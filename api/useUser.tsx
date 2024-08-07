import { type Schema } from "@/amplify/data/resource";
import { toast } from "@/components/ui/use-toast";
import { uploadFileToS3 } from "@/helpers/s3/upload-filtes";
import { AuthUser, getCurrentUser } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import { remove } from "aws-amplify/storage";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
const client = generateClient<Schema>();

export type TUpdateProfileInfo = {
  displayName: string;
};

export type User = {
  loginId?: string;
  userId: string;
  userName?: string;
  profilePicture?: string;
  hasNoProfile: boolean;
};

const mapUser = (
  user: AuthUser,
  profileData: Schema["User"]["type"] | undefined | null
): User => ({
  loginId: user.signInDetails?.loginId,
  userId: user.username,
  userName: profileData?.name || undefined,
  profilePicture: profileData?.profilePicture || undefined,
  hasNoProfile: !profileData?.profileId,
});

const fetchUser = async () => {
  const user = await getCurrentUser();
  const { data, errors } = await client.models.User.get({
    profileId: `${user.username}::${user.username}`,
  });
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

  return { user, createProfile, updateProfileInfo, updateProfilePicture };
};

export default useCurrentUser;
