export const isCmdEnter = (event: KeyboardEvent) => {
  return event.key === "Enter" && (event.metaKey || event.ctrlKey);
};
