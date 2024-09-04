import { Person } from "@/api/usePerson";
import {
  PersonAccount,
  PersonAccountCreateProps,
  PersonAccountUpdateProps,
} from "@/helpers/person/accounts";
import { format } from "date-fns";
import { filter, flatMap, flow } from "lodash/fp";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import LoadingAccordionItem from "../ui-elements/accordion/LoadingAccordionItem";
import PersonAccountForm from "./PersonAccountForm";

type PersonAccountsProps = {
  person?: Person;
  onCreate: (data: PersonAccountCreateProps) => Promise<string | undefined>;
  onChange: (data: PersonAccountUpdateProps) => Promise<string | undefined>;
  onDelete: (personAccountId: string) => Promise<string | undefined>;
};

const PersonAccounts: FC<PersonAccountsProps> = ({
  person,
  onCreate,
  onChange,
  onDelete,
}) =>
  !person ? (
    <LoadingAccordionItem
      value="loading-accounts"
      sizeTitle="lg"
      sizeSubtitle="base"
    />
  ) : (
    <DefaultAccordionItem
      value="person-accounts"
      triggerTitle="Work history"
      triggerSubTitle={flow(
        filter((pa: PersonAccount) => pa.isCurrent),
        flatMap((pa) => [
          pa.position,
          pa.accountName,
          pa.startDate && `since ${format(pa.startDate, "PP")}`,
        ])
      )(person.accounts)}
    >
      <div className="space-y-4">
        <PersonAccountForm personName={person.name} onCreate={onCreate} />

        {person.accounts.map((pa) => (
          <div key={pa.personAccountId}>
            <div className="flex flex-row gap-2 items-center">
              <div>
                <span>{pa.position}</span>
                <span className="ml-2 font-semibold">
                  <Link
                    href={`/accounts/${pa.accountId}`}
                    className="hover:underline hover:underline-offset-2"
                  >
                    {pa.accountName}
                  </Link>
                </span>
              </div>
              <PersonAccountForm
                personName={person.name}
                personAccount={pa}
                onChange={onChange}
              />
              <Trash2
                className="w-5 h-5 text-muted-foreground hover:text-primary"
                onClick={() => onDelete(pa.personAccountId)}
              />
            </div>
            <div className="text-muted-foreground">
              <small>
                {pa.startDate &&
                  !pa.endDate &&
                  `Since ${format(pa.startDate, "PP")}`}
                {pa.startDate &&
                  pa.endDate &&
                  `Between ${format(pa.startDate, "PP")} and ${format(
                    pa.endDate,
                    "PP"
                  )}`}
                {!pa.startDate &&
                  pa.endDate &&
                  `Till ${format(pa.endDate, "PP")}`}
              </small>
            </div>
          </div>
        ))}
      </div>
    </DefaultAccordionItem>
  );

export default PersonAccounts;
