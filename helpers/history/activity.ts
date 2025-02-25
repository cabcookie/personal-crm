import { flow, get, map, identity, replace, sortBy } from "lodash/fp";
import { Project } from "./project";
import { makeDate, getLocaleDateString } from "./generals";
import { getTextFromJsonContent } from "@/components/ui-elements/editors/helpers/text-generation";
import { createDocument } from "@/components/ui-elements/editors/helpers/transformers";

export type Note = {
  id: string;
  date: Date;
  label: string;
  notes: string;
};

export const mapNotes = flow(
  identity<Project>,
  get("activities"),
  map("activity"),
  map(
    (a): Note => ({
      id: a.id,
      date: makeDate(a.createdAt, a.finishedOn),
      label: `${!a.forMeeting ? `On ${getLocaleDateString(a.createdAt, a.finishedOn)}` : `Meeting: ${a.forMeeting.topic} (${getLocaleDateString(a.createdAt, a.finishedOn)})`}`,
      notes: flow(
        identity<typeof a>,
        createDocument,
        getTextFromJsonContent,
        replace(/\[\]\n\n/g, "[] "),
        replace(/\[x\]\n\n/g, "[x] ")
      )(a),
    })
  ),
  sortBy((a) => a.date.getTime())
);
