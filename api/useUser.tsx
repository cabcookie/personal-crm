import { type Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { getCurrentUser } from "aws-amplify/auth";
import useSWR from "swr";
import { handleApiErrors } from "./globals";
const client = generateClient<Schema>();

const fetchUser = async () => {
  const { username, signInDetails } = await getCurrentUser();
  const { data, errors } = await client.models.User.get({
    profileId: `${username}::${username}`,
  });
  if (errors) throw errors;
  return {
    loginId: signInDetails?.loginId,
    userId: username,
    userName: data?.name,
    hasNoProfile: !data,
  };
};

const useCurrentUser = () => {
  const { data: user } = useSWR("/api/profile", fetchUser);

  const createProfile = async (finished: () => void) => {
    if (!user || !user.hasNoProfile) {
      finished();
      return;
    }
    console.log("Creating user profile…");
    const { errors } = await client.models.User.create({
      email: user.loginId,
      profileId: `${user.userId}::${user.userId}`,
    });
    if (errors) handleApiErrors(errors, "Creating User Profile failed");
    finished();
  };

  return { user, createProfile };
};

export default useCurrentUser;
