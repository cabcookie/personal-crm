import { FC } from "react";
import { Card } from "../ui/card";

/**
 * Renders the meeting summary JSON produced by the server-side summarizer.
 * Tolerant of shape drift: falls back to a raw JSON dump if the expected
 * structure isn't present. People are referenced as { name, id }; we show the
 * name inline.
 */

type Person = { name?: string; id?: string };
type Item = { text?: string; people?: Person[] };
type ProjectSummary = {
  projectId?: string;
  projectName?: string;
  accomplishments?: Item[];
  newTasks?: Item[];
  blockers?: Item[];
};
type Summary = {
  projects?: ProjectSummary[];
  generalNotes?: Item[];
  raw?: string;
};

const ItemList: FC<{ title: string; items?: Item[] }> = ({ title, items }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="space-y-0.5">
      <p className="text-xs font-semibold text-muted-foreground">{title}</p>
      <ul className="list-disc pl-5 space-y-0.5">
        {items.map((it, i) => (
          <li key={i} className="text-sm leading-snug">
            {it.text}
            {it.people && it.people.length > 0 && (
              <span className="text-muted-foreground">
                {" "}
                (
                {it.people
                  .map((p) => p.name)
                  .filter(Boolean)
                  .join(", ")}
                )
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

const MeetingSummaryView: FC<{ summary: unknown }> = ({ summary }) => {
  const s = summary as Summary | null;
  if (!s) return null;

  const hasStructured =
    (s.projects && s.projects.length > 0) ||
    (s.generalNotes && s.generalNotes.length > 0);

  return (
    <Card className="p-3 space-y-3">
      <h4 className="text-sm font-semibold">Zusammenfassung</h4>

      {!hasStructured ? (
        <pre className="text-xs whitespace-pre-wrap text-muted-foreground">
          {s.raw ?? JSON.stringify(summary, null, 2)}
        </pre>
      ) : (
        <>
          {s.projects?.map((p, i) => (
            <div key={p.projectId ?? i} className="space-y-1">
              <p className="font-medium text-sm">{p.projectName}</p>
              <ItemList title="Erreicht" items={p.accomplishments} />
              <ItemList title="Neue Aufgaben" items={p.newTasks} />
              <ItemList title="Blocker" items={p.blockers} />
            </div>
          ))}
          {s.generalNotes && s.generalNotes.length > 0 && (
            <ItemList title="Allgemeine Notizen" items={s.generalNotes} />
          )}
        </>
      )}
    </Card>
  );
};

export default MeetingSummaryView;
