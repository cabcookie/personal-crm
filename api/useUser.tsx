import { type Schema } from "@/amplify/data/resource";
import { toast } from "@/components/ui/use-toast";
import { getDateOrUndefined } from "@/helpers/functional";
import { uploadFileToS3 } from "@/helpers/s3/upload-files";
import { AuthUser, getCurrentUser } from "aws-amplify/auth";
import { SelectionSet } from "aws-amplify/data";
import { remove } from "aws-amplify/storage";
import { isFuture } from "date-fns";
import { filter, first, flow, get, map, sortBy } from "lodash/fp";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
import { client } from "@/lib/amplify";

export type TUpdateProfileInfo = {
  displayName: string;
};

const selectionSet = [
  "name",
  "profilePicture",
  "profileId",
  "personId",
  "promptGeneral",
  "promptWorkActivity",
  "promptWorkGoals3Years",
  "promptWorkGoals12Months",
  "promptFamilyActivity",
  "promptFamilyGoals3Years",
  "promptFamilyGoals12Months",
  "promptHobbyActivity",
  "promptHobbyGoals3Years",
  "promptHobbyGoals12Months",
  "person.name",
  "person.accounts.accountId",
  "person.accounts.startDate",
  "person.accounts.endDate",
] as const;

/** Fixed contexts (mirrors the Context enum). */
export type PromptContext = "work" | "family" | "hobby";

export type ContextPrompt = {
  activity: string;
  goals3Years: string;
  goals12Months: string;
};

export type UserPrompts = {
  general: string;
  work: ContextPrompt;
  family: ContextPrompt;
  hobby: ContextPrompt;
};

/** The DynamoDB attribute names for each prompt field (single-field saves). */
export type PromptField =
  | "promptGeneral"
  | "promptWorkActivity"
  | "promptWorkGoals3Years"
  | "promptWorkGoals12Months"
  | "promptFamilyActivity"
  | "promptFamilyGoals3Years"
  | "promptFamilyGoals12Months"
  | "promptHobbyActivity"
  | "promptHobbyGoals3Years"
  | "promptHobbyGoals12Months";

/** Map a context + slot to the corresponding DynamoDB attribute name. */
export const promptFieldFor = (
  context: PromptContext,
  slot: keyof ContextPrompt
): PromptField => {
  const ctx = context.charAt(0).toUpperCase() + context.slice(1);
  const slotName =
    slot === "activity"
      ? "Activity"
      : slot === "goals3Years"
        ? "Goals3Years"
        : "Goals12Months";
  return `prompt${ctx}${slotName}` as PromptField;
};

/** Apply a single-field value back onto a UserPrompts object (for cache). */
const applyPromptField = (
  prompts: UserPrompts,
  attribute: PromptField,
  value: string
): UserPrompts => {
  if (attribute === "promptGeneral") return { ...prompts, general: value };
  const map: Record<
    Exclude<PromptField, "promptGeneral">,
    [PromptContext, keyof ContextPrompt]
  > = {
    promptWorkActivity: ["work", "activity"],
    promptWorkGoals3Years: ["work", "goals3Years"],
    promptWorkGoals12Months: ["work", "goals12Months"],
    promptFamilyActivity: ["family", "activity"],
    promptFamilyGoals3Years: ["family", "goals3Years"],
    promptFamilyGoals12Months: ["family", "goals12Months"],
    promptHobbyActivity: ["hobby", "activity"],
    promptHobbyGoals3Years: ["hobby", "goals3Years"],
    promptHobbyGoals12Months: ["hobby", "goals12Months"],
  };
  const [context, slot] = map[attribute];
  return {
    ...prompts,
    [context]: { ...prompts[context], [slot]: value },
  };
};

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
  prompts: UserPrompts;
};

const mapUser = (user: AuthUser, profileData: UserData | null): User => ({
  loginId: user.signInDetails?.loginId,
  userId: user.username,
  userName: profileData?.person?.name ?? profileData?.name ?? undefined,
  profilePicture: profileData?.profilePicture ?? undefined,
  hasNoProfile: !profileData?.profileId,
  personId: profileData?.personId ?? undefined,
  prompts: {
    general: profileData?.promptGeneral ?? "",
    work: {
      activity: profileData?.promptWorkActivity ?? "",
      goals3Years: profileData?.promptWorkGoals3Years ?? "",
      goals12Months: profileData?.promptWorkGoals12Months ?? "",
    },
    family: {
      activity: profileData?.promptFamilyActivity ?? "",
      goals3Years: profileData?.promptFamilyGoals3Years ?? "",
      goals12Months: profileData?.promptFamilyGoals12Months ?? "",
    },
    hobby: {
      activity: profileData?.promptHobbyActivity ?? "",
      goals3Years: profileData?.promptHobbyGoals3Years ?? "",
      goals12Months: profileData?.promptHobbyGoals12Months ?? "",
    },
  },
  currentAccountId: flow(
    get("person.accounts"),
    filter((a: AccountData) => !a.endDate || isFuture(new Date(a.endDate))),
    map((a) => ({
      accountId: a.accountId,
      startDate: getDateOrUndefined(a.startDate),
      endDate: getDateOrUndefined(a.endDate),
    })),
    sortBy((a) => -(a.startDate?.getTime() || 0)),
    first,
    get("accountId")
  )(profileData),
});

export const fetchUser = async () => {
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

  /**
   * Persist the full AI user prompts object (used when saving everything at
   * once). Prefer `savePromptField` for per-field on-blur saves.
   */
  const updatePrompts = async (prompts: UserPrompts) => {
    if (!user) return;
    const updated: User = { ...user, prompts };
    mutate(updated, false);
    const { data, errors } = await client.models.User.update({
      profileId: `${user.userId}::${user.userId}`,
      promptGeneral: prompts.general,
      promptWorkActivity: prompts.work.activity,
      promptWorkGoals3Years: prompts.work.goals3Years,
      promptWorkGoals12Months: prompts.work.goals12Months,
      promptFamilyActivity: prompts.family.activity,
      promptFamilyGoals3Years: prompts.family.goals3Years,
      promptFamilyGoals12Months: prompts.family.goals12Months,
      promptHobbyActivity: prompts.hobby.activity,
      promptHobbyGoals3Years: prompts.hobby.goals3Years,
      promptHobbyGoals12Months: prompts.hobby.goals12Months,
    });
    if (errors) handleApiErrors(errors, "Updating AI prompts failed");
    mutate(updated);
    return data?.profileId;
  };

  /**
   * Persist ONE prompt attribute (on-blur auto-save). Maps a logical field to
   * its DynamoDB attribute and patches the SWR cache against the latest store
   * so concurrent single-field saves don't clobber each other.
   */
  const savePromptField = async (
    attribute: PromptField,
    value: string
  ): Promise<void> => {
    if (!user) return;
    const updated: User = {
      ...user,
      prompts: applyPromptField(user.prompts, attribute, value),
    };
    mutate(updated, false);
    const { errors } = await client.models.User.update({
      profileId: `${user.userId}::${user.userId}`,
      [attribute]: value,
    });
    if (errors) handleApiErrors(errors, "Saving prompt failed");
    mutate(updated);
  };

  return {
    user,
    createProfile,
    updateProfileInfo,
    updateProfilePicture,
    linkPersonToUser,
    updatePrompts,
    savePromptField,
  };
};

export default useCurrentUser;
