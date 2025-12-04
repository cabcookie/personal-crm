/* ========= FUNCTIONS ========= */

export const mapQuery =
  (level: number) =>
  (prev: string, curr: string | any[]): string => {
    const indent = "  ".repeat(level);
    if (typeof curr === "string") {
      return `${prev}${prev === "" ? "" : "\n"}${indent}${curr}`;
    } else if (Array.isArray(curr)) {
      return `${prev} {\n${curr.reduce<string>(mapQuery(level + 1), "")}\n${indent}}`;
    }
    return prev;
  };

/* =========== TYPES =========== */

export type NextToken = {
  nextToken?: string | null;
};
