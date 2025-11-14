import { client } from "./handler";
import { mapProject, queryProject } from "./helpers";

export const fetchingProject = async (projectId: string) => {
  console.log("Fetching data for Project ID:", projectId);
  console.log("Using query:", queryProject);

  const { data, errors } = await client.graphql({
    query: queryProject,
    variables: { id: projectId },
  });

  if (errors)
    throw new Error(
      `Error in fetchingProject: ${
        errors.map((err) => err.message).join(". ") || "Query failed"
      }`
    );
  if (!data || !data.getProjects) {
    console.warn(
      "fetchingProject: No data returned for the specified project ID"
    );
    return null;
  }

  console.log("Data for project", projectId, ":", data);

  return mapProject(data.getProjects);
};
