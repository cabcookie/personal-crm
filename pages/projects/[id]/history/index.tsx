import { generateClient } from "aws-amplify/data";
import { generateClient as generateApi } from "aws-amplify/api";
import { flow, identity, get, map } from "lodash/fp";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Schema } from "@/amplify/data/resource";
import HistoryLearnings from "@/components/history/learnings";
import HistoryPeopleRoles from "@/components/history/people-roles";
import HistoryNotes from "@/components/history/notes";
import MainLayout from "@/components/layouts/MainLayout";
import { mapAccount, type AccountMapped } from "@/helpers/history/account";
import { mapNotes, type Note } from "@/helpers/history/activity";
import { getPeople, type Person, mapPeopleIds } from "@/helpers/history/person";
import { getProject, type Project } from "@/helpers/history/project";
import { Button } from "@/components/ui/button";

export const client = generateClient<Schema>();
const api = generateApi<Schema>({ authMode: "userPool" });

const loadKnowledge = async (
  projectId: string,
  setProjectName: Dispatch<SetStateAction<string | null>>,
  setAccounts: Dispatch<SetStateAction<AccountMapped[] | null>>,
  setPeople: Dispatch<SetStateAction<Person[] | null>>,
  setNotes: Dispatch<SetStateAction<Note[] | null>>
) => {
  const project = await getProject(projectId, setProjectName);
  if (!project) return;
  const peopleIds = project.accounts?.flatMap((a) => mapPeopleIds(a?.account));
  const people = await getPeople(peopleIds);
  setPeople(people);
  flow(identity<Project>, mapNotes, setNotes)(project);
  flow(
    identity<Project>,
    get("accounts"),
    map((a) => mapAccount(a?.account, people)),
    setAccounts
  )(project);
};

const ProjectHistoryPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const projectId = Array.isArray(id) ? id[0] : id;
  const [accounts, setAccounts] = useState<AccountMapped[] | null>(null);
  const [projectName, setProjectName] = useState<string | null>("Loading…");
  const [people, setPeople] = useState<Person[] | null>(null);
  const [notes, setNotes] = useState<Note[] | null>(null);

  useEffect(() => {
    if (!projectId) return;
    loadKnowledge(projectId, setProjectName, setAccounts, setPeople, setNotes);
  }, [projectId]);

  const generateContent = async () => {
    console.log("generateContent");
    const { data, errors } = await api.generations.rewriteProjectNotes({
      content: "How are you doing?",
    });
    console.log({ data, errors });
  };

  return (
    <MainLayout title={projectName ?? "Error"} sectionName="Projects">
      <div className="flex flex-col gap-12">
        <Button onClick={generateContent}>TEST</Button>
        {accounts?.map((a) => (
          <div className="flex flex-col gap-8" key={a.id}>
            <h1 className="text-xl font-semibold">Account: {a.name}</h1>

            <HistoryLearnings account={a} />

            <HistoryPeopleRoles people={people} />

            <HistoryNotes notes={notes} />
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default ProjectHistoryPage;
