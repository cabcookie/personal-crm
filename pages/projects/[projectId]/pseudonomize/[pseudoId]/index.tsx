import { generateClient } from "aws-amplify/data";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Schema } from "@/amplify/data/resource";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const client = generateClient<Schema>();

type ProjectSummary = Schema["ProjectSummaryRequest"]["type"];

const getProjectName = async (
  projectId: string,
  setProjectName: (name: string) => void
) => {
  const { data, errors } = await client.models.Projects.get(
    { id: projectId },
    { selectionSet: ["project"] }
  );
  if (errors || !data) {
    setProjectName("ERROR");
    return;
  }
  setProjectName(data.project);
};

const getPseudo = (
  pseudoId: string,
  setSummary: (item: ProjectSummary) => void
) => {
  const sub = client.models.ProjectSummaryRequest.observeQuery().subscribe({
    next: ({ items }) => {
      const item = items.find((i) => i.id === pseudoId);
      if (!item) return;
      setSummary(item);
    },
  });
  return () => sub.unsubscribe();
};

const ProjectPseudonomizePage = () => {
  const router = useRouter();
  const { projectId: pid, pseudoId: psid } = router.query;
  const projectId = Array.isArray(pid) ? pid[0] : pid;
  const pseudoId = Array.isArray(psid) ? psid[0] : psid;
  const [projectName, setProjectName] = useState<string | null>("Loading…");
  const [summary, setSummary] = useState<ProjectSummary | null>(null);

  useEffect(() => {
    if (!projectId) return;
    getProjectName(projectId, setProjectName);
  }, [projectId]);

  useEffect(() => {
    if (!pseudoId) return;
    getPseudo(pseudoId, setSummary);
  }, [pseudoId]);

  const updateModel = async () => {
    if (!pseudoId) return;
    const randomString = Math.random().toString(36).substring(2, 7);
    await client.models.ProjectSummaryRequest.update({
      id: pseudoId,
      modelUsed: randomString,
    });
  };

  return (
    <MainLayout title={projectName ?? "Error"} sectionName="Projects">
      <div className="space-y-2">
        <div className="ml-1 md:ml-2 flex flex-row gap-2">
          <Button asChild size="sm">
            <Link href={`/projects/${projectId}`} className="flex gap-2">
              <ChevronLeft className="size-4" />
              <div>Back</div>
            </Link>
          </Button>
        </div>
        <div>{JSON.stringify(summary, null, 2)}</div>
        <div>
          <Button onClick={updateModel}>Update model</Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProjectPseudonomizePage;
