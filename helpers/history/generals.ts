import { toLocaleDateString } from "@/helpers/functional";
import { flow } from "lodash/fp";

export const makeDate = (fallback: string, date?: string | null) =>
  new Date(date || fallback);

export const getLocaleDateString = flow(makeDate, toLocaleDateString);

export type Learning = {
  id: string;
  label: string;
  learnedOn: Date;
  learning: string;
};
