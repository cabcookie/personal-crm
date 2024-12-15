import { Person } from "@/api/usePerson";
import { User } from "@/api/useUser";
import { PersonAccount } from "@/helpers/person/accounts";
import { PersonJob } from "@/pages/chat";
import { find, flow, get, identity } from "lodash/fp";
import { Dispatch, SetStateAction } from "react";

export const setCurrentJobByUser = (
  user: User | undefined,
  person: Person | undefined,
  setCurrentJob: Dispatch<SetStateAction<PersonJob | undefined>>
) =>
  flow(
    identity<typeof person>,
    get("accounts"),
    find<PersonAccount>(["isCurrent", true]),
    (account) =>
      !account
        ? undefined
        : {
            user: user?.userName,
            employer: account.accountName,
            jobRole: account.position,
          },
    setCurrentJob
  )(person);
