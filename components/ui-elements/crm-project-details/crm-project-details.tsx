import useCrmProject from "@/api/useCrmProject";
import { FC, FormEvent, useState } from "react";
import RecordDetails from "../record-details/record-details";
import SubmitButton from "../submit-button";
import {
  addDaysToDate,
  makeRevenueString,
  toLocaleDateString,
} from "@/helpers/functional";
import CrmProjectForm from "./crm-project-form";
import { CrmProject } from "@/api/useCrmProjects";
import Link from "next/link";

type CrmProjectDetailsProps = {
  projectId: string;
  crmProjectId: string;
  crmProjectDetails?: boolean;
};

const makeNewCrmProject = (projectId: string): CrmProject => ({
  id: crypto.randomUUID(),
  name: "",
  arr: 0,
  closeDate: addDaysToDate(60)(new Date()),
  projectIds: [projectId],
  stage: "Prospect",
  tcv: 0,
  crmId: "",
});

const CrmProjectDetails: FC<CrmProjectDetailsProps> = ({
  projectId,
  crmProjectId,
  crmProjectDetails,
}) => {
  const { crmProject, createCrmProject } = useCrmProject(crmProjectId);
  const [newCrmProject, setNewCrmProject] = useState<CrmProject | undefined>(
    !crmProject ? makeNewCrmProject(projectId) : undefined
  );

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newCrmProject) return;
    const data = await createCrmProject(newCrmProject);
    if (data) setNewCrmProject(makeNewCrmProject(projectId));
  };

  const getCrmId = (input: string) => {
    if (/^006\w{15}$/.test(input)) return input;
    const match = input.match(/\/Opportunity\/(006\w{15})\//);
    if (match) return match[1];
    return "";
  };

  const handleUpdateNewProject = (fieldName: string, val: string | Date) => {
    if (!newCrmProject) return;
    switch (fieldName) {
      case "name":
        setNewCrmProject({ ...newCrmProject, name: val as string });
        break;
      case "arr":
        setNewCrmProject({ ...newCrmProject, arr: parseInt(val as string) });
        break;
      case "tcv":
        setNewCrmProject({ ...newCrmProject, tcv: parseInt(val as string) });
        break;
      case "stage":
        setNewCrmProject({ ...newCrmProject, stage: val as string });
        break;
      case "closeDate":
        setNewCrmProject({ ...newCrmProject, closeDate: val as Date });
        break;
      case "crmId":
        const crmId = getCrmId(val as string);
        setNewCrmProject({ ...newCrmProject, crmId });
        break;

      default:
        break;
    }
  };

  return !crmProject ? (
    <RecordDetails title="Create New CRM Project">
      <form onSubmit={handleFormSubmit}>
        <CrmProjectForm
          crmProject={newCrmProject}
          onChange={handleUpdateNewProject}
        />
        <SubmitButton type="submit">Create CRM Project</SubmitButton>
      </form>
    </RecordDetails>
  ) : (
    <RecordDetails
      title={
        <>
          CRM:{" "}
          {crmProject.crmId && crmProject.crmId.length > 6 ? (
            <Link
              href={`https://aws-crm.lightning.force.com/lightning/r/Opportunity/${crmProject.crmId}/view`}
              target="_blank"
            >
              {crmProject.name}
            </Link>
          ) : (
            crmProject.name
          )}{" "}
          (Stage: {crmProject.stage})
        </>
      }
    >
      <div>
        {crmProject.arr > 0 && (
          <div>
            Annual recurring revenue: {makeRevenueString(crmProject.arr)}
          </div>
        )}
        {crmProject.tcv > 0 && (
          <div>Total contract volume: {makeRevenueString(crmProject.tcv)}</div>
        )}
        <div>Close date: {toLocaleDateString(crmProject.closeDate)}</div>
        {crmProjectDetails && (
          <div style={{ fontSize: "1.2rem", color: "red" }}>
            Projects can not be updated at the moment
          </div>
        )}
      </div>
    </RecordDetails>
  );
};

export default CrmProjectDetails;