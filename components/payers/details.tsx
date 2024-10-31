import usePayer from "@/api/usePayer";
import { Accordion } from "@/components/ui/accordion";
import { FC } from "react";
import AccountSelector from "../ui-elements/selectors/account-selector";
import PayerAccounts from "./accounts";
import PayerFinancials from "./financials";
import PayerReseller from "./reseller";

type PayerDetailsProps = {
  showLinkedAccounts?: boolean;
  showFinancials?: boolean;
  showReseller?: boolean;
  payerId: string | undefined;
};

const PayerDetails: FC<PayerDetailsProps> = ({
  payerId,
  showFinancials = true,
  showLinkedAccounts = true,
  showReseller = true,
}) => {
  const { attachReseller } = usePayer(payerId);

  return (
    payerId && (
      <Accordion type="single" collapsible className="w-full">
        <div className="mt-2">
          <AccountSelector
            value=""
            onChange={attachReseller}
            placeholder="Attach reseller…"
          />
        </div>

        <PayerAccounts
          payerId={payerId}
          showLinkedAccounts={showLinkedAccounts}
        />

        <PayerFinancials payerId={payerId} showFinancials={showFinancials} />

        <PayerReseller payerId={payerId} showReseller={showReseller} />
      </Accordion>
    )
  );
};

export default PayerDetails;
