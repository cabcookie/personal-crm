import { type Schema } from "@/amplify/data/resource";
import { toast } from "@/components/ui/use-toast";
import { uploadFileToS3 } from "@/helpers/s3/upload-filtes";
import { AuthUser, getCurrentUser } from "aws-amplify/auth";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { remove } from "aws-amplify/storage";
import { isFuture } from "date-fns";
import { filter, first, flow, get, map, sortBy } from "lodash/fp";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
const client = generateClient<Schema>();

export type TUpdateProfileInfo = {
  displayName: string;
};

const selectionSet = [
  "name",
  "profilePicture",
  "profileId",
  "personId",
  "person.name",
  "person.accounts.accountId",
  "person.accounts.startDate",
  "person.accounts.endDate",
] as const;

type UserData = SelectionSet<Schema["User"]["type"], typeof selectionSet>;
type AccountData = UserData["person"]["accounts"][number];

export type User = {
  loginId?: string;
  userId: string;
  userName?: string;
  profilePicture?: string;
  hasNoProfile: boolean;
  personId?: string;
  currentAccountId?: string;
};

const mapUser = (user: AuthUser, profileData: UserData | null): User => ({
  loginId: user.signInDetails?.loginId,
  userId: user.username,
  userName: profileData?.person?.name ?? profileData?.name ?? undefined,
  profilePicture: profileData?.profilePicture ?? undefined,
  hasNoProfile: !profileData?.profileId,
  personId: profileData?.personId ?? undefined,
  currentAccountId: flow(
    get("person.accounts"),
    filter((a: AccountData) => !a.endDate || isFuture(new Date(a.endDate))),
    map((a) => ({
      accountId: a.accountId,
      startDate: !a.startDate ? undefined : new Date(a.startDate),
      endDate: !a.endDate ? undefined : new Date(a.endDate),
    })),
    sortBy((a) => -(a.startDate?.getTime() || 0)),
    first,
    get("accountId")
  )(profileData),
});

const fetchUser = async () => {
  const user = await getCurrentUser();
  const { data, errors } = await client.models.User.get(
    {
      profileId: `${user.username}::${user.username}`,
    },
    { selectionSet }
  );
  if (errors) {
    handleApiErrors(errors, "Error loading user");
    throw errors;
  }
  try {
    return mapUser(user, data);
  } catch (error) {
    console.error("fetchUser", { error });
    throw error;
  }
};

const useCurrentUser = () => {
  const { data: user, mutate } = useSWR("/api/profile", fetchUser);

  const createProfile = async (finished: () => void) => {
    if (!user || !user.hasNoProfile) {
      finished();
      return;
    }
    const existing = await fetchUser();
    if (!existing.hasNoProfile) return;
    const { errors } = await client.models.User.create({
      email: user.loginId,
      profileId: `${user.userId}::${user.userId}`,
    });
    if (errors) handleApiErrors(errors, "Creating User Profile failed");
    mutate(user);
    finished();
  };

  const updateProfileInfo = async ({ displayName }: TUpdateProfileInfo) => {
    if (!user) return;
    const updated: User = { ...user, userName: displayName };
    mutate(updated, false);
    const { data, errors } = await client.models.User.update({
      profileId: `${user.userId}::${user.userId}`,
      name: displayName,
    });
    if (errors) handleApiErrors(errors, "Update user information failed");
    mutate(updated);
    if (!data) return;
    toast({
      title: "User information updated",
      description: `Display name: ${data.name}`,
    });
    return data.profileId;
  };

  const updateProfilePicture = async (file: File, finished: () => void) => {
    if (!user) return;
    const { profilePicture: oldPicture } = await fetchUser();
    const { s3Path } = await uploadFileToS3(
      file,
      "profile-images/${identityId}/${filename}"
    );
    const updated: User = { ...user, profilePicture: s3Path };
    mutate(updated, false);
    const { data, errors } = await client.models.User.update({
      profileId: `${user.userId}::${user.userId}`,
      profilePicture: s3Path,
    });
    if (errors) handleApiErrors(errors, "Updating profile image failed");
    mutate(updated);
    if (!data) return;
    toast({ title: "Updated profile image" });
    finished();
    // delete old image
    if (oldPicture) await remove({ path: oldPicture });
    return data.profileId;
  };

  const linkPersonToUser = async (personId: string | null) => {
    if (!user) return;
    const updated: User = { ...user, personId: personId ?? undefined };
    mutate(updated, false);
    const { data, errors } = await client.models.User.update({
      profileId: `${user.userId}::${user.userId}`,
      personId,
    });
    if (errors) handleApiErrors(errors, "Linking person to profile failed");
    mutate(updated);
    return data?.profileId;
  };

  return {
    user,
    createProfile,
    updateProfileInfo,
    updateProfilePicture,
    linkPersonToUser,
  };
};

export default useCurrentUser;
