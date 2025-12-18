export * from "./accounts";
export * from "./calculate-next-run";
export * from "./get-client";
export * from "./handle-recurring-export";
export * from "./load-task-record";
export * from "./markdown";
export * from "./people";
export * from "./projects";
export * from "./queries";
export * from "./s3-upload";
export * from "./update-task";

export const notNull = <T>(input: T): boolean => !!input;
