import { CrmProject, crmStages } from "@/api/useCrmProjects";
import { FC, useState } from "react";
import styles from "./CrmProjectDetails.module.css";
import Input from "../form-fields/input";
import DateSelector from "../date-selector";
import Select from "react-select";
import Link from "next/link";

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

  return (
    crmProject && (
      <div>
        <div className={styles.oneRow}>
          <Input
            value={crmProject.name}
            onChange={(newVal) => onChange({ name: newVal })}
            label="Name"
            placeholder="Opportunity Name"
            className={styles.fullWidth}
            inputClassName={styles.fullWidth}
          />
          <Input
            value={crmProject.crmId || ""}
            onChange={(newVal) => onChange({ crmId: newVal })}
            label={
              <div className={styles.oneLine}>
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
            className={styles.fullWidth}
            inputClassName={styles.fullWidth}
          />
        </div>
        <div className={styles.oneRow}>
          <Input
            value={crmProject.arr.toString()}
            onChange={(newval) => onChange({ arr: newval })}
            label="Annual Recurring Revenue"
            className={styles.fullWidth}
            inputClassName={styles.fullWidth}
          />
          <Input
            value={crmProject.tcv.toString()}
            onChange={(newval) => onChange({ tcv: newval })}
            label="Total Contract Volume"
            className={styles.fullWidth}
            inputClassName={styles.fullWidth}
          />
        </div>
        <div className={styles.oneRowy}>
          <div className={styles.fullWidth}>
            <div>Stage</div>
            <Select
              options={mappedOptions}
              onChange={selectStage}
              value={selectedOption}
              isSearchable
              className={styles.fullWidth}
            />
          </div>
          <div className={styles.fullWidth}>
            <div>Close Date</div>
            <DateSelector
              date={crmProject.closeDate}
              setDate={(date) => onChange({ closeDate: date })}
            />
          </div>
        </div>
      </div>
    )
  );
};

export default CrmProjectForm;
