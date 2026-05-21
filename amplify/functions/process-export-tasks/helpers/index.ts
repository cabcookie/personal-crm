export * from "./accounts";
export * from "./activities";
export * from "./calculate-next-run";
export * from "./dynamodb";
export * from "./get-client";
export * from "./handle-recurring-export";
export * from "./load-task-record";
export * from "./markdown";
export * from "./meetings";
export * from "./projects";
export * from "./s3-upload";
export * from "./tiptap-doc";
export * from "./update-task";

export const notNull = <T>(input: T): boolean => !!input;
