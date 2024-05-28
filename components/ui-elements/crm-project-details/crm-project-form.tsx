import { CrmProject, crmStages } from "@/api/useCrmProjects";
import Link from "next/link";
import { FC, ReactNode, useState } from "react";
import Select from "react-select";
import DateSelector from "../date-selector";
import Input from "../form-fields/input";

export type CrmProjectOnChangeFields = {
  name?: string;
  arr?: string;
  tcv?: string;
  stage?: string;
  closeDate?: Date;
  crmId?: string;
};

type CrmProjectFormProps = {
  crmProject?: CrmProject;
  onChange: (props: CrmProjectOnChangeFields) => void;
};

const CrmProjectForm: FC<CrmProjectFormProps> = ({ crmProject, onChange }) => {
  const [mappedOptions] = useState(
    crmStages.map((stage) => ({ value: stage, label: stage }))
  );
  const [selectedOption] = useState<any>(
    mappedOptions.find(({ label }) => label === crmProject?.stage)
  );

  const selectStage = (selectedOption: any) => {
    onChange({ stage: selectedOption.label });
  };

  const OneRow = (props: { children: ReactNode }) => (
    <div className="flex flex-col md:flex-row gap-4 w-full p-0 m-0 mb-4">
      {props.children}
    </div>
  );

  return (
    crmProject && (
      <div>
        <OneRow>
          <Input
            value={crmProject.name}
            onChange={(newVal) => onChange({ name: newVal })}
            label="Name"
            placeholder="Opportunity Name"
            className="w-full"
            inputClassName="w-full"
          />
          <Input
            value={crmProject.crmId || ""}
            onChange={(newVal) => onChange({ crmId: newVal })}
            label={
              <div className="flex flex-row gap-4 w-full">
                <div>CRM ID</div>
                {crmProject.crmId && crmProject.crmId.length > 6 && (
                  <Link
                    href={`https://aws-crm.lightning.force.com/lightning/r/Opportunity/${crmProject.crmId}/view`}
                    target="_blank"
                  >
                    <small>Visit CRM</small>
                  </Link>
                )}
              </div>
            }
            placeholder="Paste Opportunity URL or ID..."
            className="w-full"
            inputClassName="w-full"
          />
        </OneRow>

        <OneRow>
          <Input
            value={crmProject.arr.toString()}
            onChange={(newval) => onChange({ arr: newval })}
            label="Annual Recurring Revenue"
            className="w-full"
            inputClassName="w-full"
          />
          <Input
            value={crmProject.tcv.toString()}
            onChange={(newval) => onChange({ tcv: newval })}
            label="Total Contract Volume"
            className="w-full"
            inputClassName="w-full"
          />
        </OneRow>

        <OneRow>
          <div className="w-full">
            <div>Stage</div>
            <Select
              options={mappedOptions}
              onChange={selectStage}
              value={selectedOption}
              isSearchable
              className="w-full"
            />
          </div>
          <div className="w-full">
            <div>Close Date</div>
            <DateSelector
              date={crmProject.closeDate}
              setDate={(date) => onChange({ closeDate: date })}
            />
          </div>
        </OneRow>
      </div>
    )
  );
};

export default CrmProjectForm;
