import { queryProject, client } from "../helpers";

export const fetchingProject = async (projectId: string) => {
  console.log("Fetching data for Project ID:", projectId);

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
  if (!data || !data.getProjects)
    throw new Error(
      `Error in fetchingProject: No data returned for Project ID ${projectId}`
    );

  return data.getProjects;
};
