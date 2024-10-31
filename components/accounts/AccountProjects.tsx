import { Account } from "@/api/ContextAccounts";
import { useProjectsContext } from "@/api/ContextProjects";
import {
  calcPipelineByAccountId,
  make2YearsRevenueText,
} from "@/helpers/projects";
import { flow } from "lodash/fp";
import { FC } from "react";
import { ProjectFilterProvider } from "../projects/useProjectFilter";
import { SearchProvider } from "../search/useSearch";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import ProjectList from "./ProjectList";

type AccountProjectsProps = {
  account: Account;
  showProjects?: boolean;
};

const AccountProjects: FC<AccountProjectsProps> = ({
  account,
  showProjects,
}) => {
  const { projects } = useProjectsContext();

  return (
    <DefaultAccordionItem
      value="Projects"
      triggerTitle="Projects"
      triggerSubTitle={flow(
        calcPipelineByAccountId(account.id),
        make2YearsRevenueText
      )(projects)}
      isVisible={!!showProjects}
    >
      <SearchProvider>
        <ProjectFilterProvider accountId={account.id}>
          <ProjectList />
        </ProjectFilterProvider>
      </SearchProvider>
    </DefaultAccordionItem>
  );
};

export default AccountProjects;
