import { useAccountsContext } from "@/api/ContextAccounts";
import { useProjectsContext } from "@/api/ContextProjects";
import { Trash2 } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { Accordion } from "../ui/accordion";
import LeanAccordianItem from "./LeanAccordionItem";

type ProjectListProps = {
  accountId: string;
};

const ProjectList: FC<ProjectListProps> = ({ accountId }) => {
  const { projects, removeAccountFromProject } = useProjectsContext();
  const { accounts } = useAccountsContext();
  const [items, setItems] = useState(
    projects?.filter((p) => p.accountIds.includes(accountId))
  );

  useEffect(
    () => setItems(projects?.filter((p) => p.accountIds.includes(accountId))),
    [accountId, projects]
  );

  return !items ? (
    "Loading…"
  ) : (
    <Accordion type="single" collapsible className="w-full">
      {items.map(({ id: projectId, project, accountIds }) => (
        <LeanAccordianItem
          key={projectId}
          value={projectId}
          title={project}
          isVisible
          className="font-semibold tracking-tight"
          link={`/projects/${projectId}`}
        >
          <div className="flex flex-col gap-2">
            <strong>Accounts</strong>
            {accountIds.map((accountId) =>
              accounts
                ?.filter(({ id }) => id === accountId)
                .map(({ name, id: accountId }) => (
                  <div key={accountId} className="flex flex-row gap-2">
                    <div>{name}</div>
                    <Trash2
                      className="pt-[0.1rem] pb-[0.4rem] text-muted-foreground hover:text-primary"
                      onClick={() =>
                        removeAccountFromProject(
                          projectId,
                          project,
                          accountId,
                          name
                        )
                      }
                    />
                  </div>
                ))
            )}
          </div>
        </LeanAccordianItem>
      ))}
    </Accordion>
  );
};

export default ProjectList;
