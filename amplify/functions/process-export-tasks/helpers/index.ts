export * from "./accounts";
export * from "./get-client";
export * from "./load-task-record";
export * from "./markdown";
export * from "./people";
export * from "./projects";
export * from "./queries";
export * from "./update-task";

export const notNull = <T>(input: T): boolean => !!input;
