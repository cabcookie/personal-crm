import { FC } from "react";
import CrmLink from "./CrmLink";
import LabelData from "./label-data";

type CrmDataProps = {
  crmId?: string;
};

const CrmData: FC<CrmDataProps> = ({ crmId }) =>
  crmId && (
    <div className="flex flex-row gap-2 items-center">
      <LabelData label="SFDC ID" data={crmId} />
      <CrmLink id={crmId} category="Opportunity" />
    </div>
  );

export default CrmData;
