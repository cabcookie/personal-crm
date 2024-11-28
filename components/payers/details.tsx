import usePayer from "@/api/usePayer";
import { Accordion } from "@/components/ui/accordion";
import { FC } from "react";
import AccountSelector from "../ui-elements/selectors/account-selector";
import PeopleSelector from "../ui-elements/selectors/people-selector";
import PayerAccounts from "./accounts";
import PayerFinancials from "./financials";
import NotesInput from "./notes-input";
import PayerReseller from "./reseller";
import PayerPerson from "./person";

type PayerDetailsProps = {
  showLinkedAccounts?: boolean;
  showFinancials?: boolean;
  showNotes?: boolean;
  showReseller?: boolean;
  showPerson?: boolean;
  payerId: string | undefined;
};

const PayerDetails: FC<PayerDetailsProps> = ({
  payerId,
  showNotes,
  showFinancials = true,
  showLinkedAccounts = true,
  showReseller = true,
  showPerson = true,
}) => {
  const { attachReseller, payer, updateNotes, attachPerson } =
    usePayer(payerId);

  return (
    payerId && (
      <Accordion type="single" collapsible className="w-full">
        {showNotes && (
          <NotesInput payer={payer} onChange={updateNotes} className="" />
        )}

        <div className="mt-2">
          <AccountSelector
            value=""
            onChange={attachReseller}
            placeholder="Attach reseller…"
          />
        </div>

        <div className="mt-2">
          <PeopleSelector
            value=""
            onChange={attachPerson}
            placeholder="Attach person…"
          />
        </div>

        <PayerAccounts
          payerId={payerId}
          showLinkedAccounts={showLinkedAccounts}
        />

        <PayerFinancials payerId={payerId} showFinancials={showFinancials} />

        <PayerReseller payerId={payerId} showReseller={showReseller} />

        <PayerPerson payerId={payerId} showPerson={showPerson} />
      </Accordion>
    )
  );
};

export default PayerDetails;
