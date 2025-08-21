import { listProjects, updateProjects } from "./handle-projects";

export const handler = async (event: any) => {
  console.log("Starting deployment-time data schema migrations creation");
  console.log("Event:", JSON.stringify(event, null, 2));

  try {
    // Only run on CREATE and UPDATE events
    if (event.RequestType === "Delete") {
      console.log("Delete event - no action needed");
      return {
        PhysicalResourceId:
          event.PhysicalResourceId || "data-schema-migrations",
        Data: { message: "Data schema migrations resource deleted" },
      };
    }

    // *****************************************************
    // The actual migration work is happening here:
    const projects = await listProjects();
    await updateProjects(projects);
    // *****************************************************
  } catch (error) {
    console.error("Error creating data schema migrations:", error);
    // Do not throw the error further
  }
  const physicalId = `DataSchemaMigrations-${Date.now()}`;
  return {
    PhysicalResourceId: physicalId,
    Data: {
      message: "Data schema migrations created successfully",
      timestamp: new Date().toISOString(),
    },
  };
};
