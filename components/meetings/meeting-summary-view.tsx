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
type TaskItem = Item & { owner?: Person | null };
type TopicSummary = {
  projectId?: string;
  projectName?: string;
  accomplishments?: Item[];
  newTasks?: TaskItem[];
  blockers?: Item[];
};
type Summary = {
  topics?: TopicSummary[];
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

/**
 * New tasks render as checkbox items led by the responsible owner, i.e.
 * "<owner>: <task>", matching how they'll be written into the topic's notes.
 */
const TaskList: FC<{ title: string; items?: TaskItem[] }> = ({
  title,
  items,
}) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="space-y-0.5">
      <p className="text-xs font-semibold text-muted-foreground">{title}</p>
      <ul className="space-y-0.5">
        {items.map((it, i) => {
          const others = (it.people ?? [])
            .map((p) => p.name)
            .filter(Boolean)
            .join(", ");
          return (
            <li key={i} className="text-sm leading-snug flex gap-1.5">
              <span className="text-muted-foreground">☐</span>
              <span>
                {it.owner?.name && (
                  <span className="font-medium">{it.owner.name}: </span>
                )}
                {it.text}
                {others && (
                  <span className="text-muted-foreground"> ({others})</span>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const MeetingSummaryView: FC<{ summary: unknown }> = ({ summary }) => {
  const s = summary as Summary | null;
  if (!s) return null;

  const hasStructured = !!s.topics && s.topics.length > 0;

  return (
    <Card className="p-3 space-y-3">
      <h4 className="text-sm font-semibold">Summary</h4>

      {!hasStructured ? (
        <pre className="text-xs whitespace-pre-wrap text-muted-foreground">
          {s.raw ?? JSON.stringify(summary, null, 2)}
        </pre>
      ) : (
        s.topics?.map((t, i) => (
          <div key={t.projectId ?? i} className="space-y-1">
            <p className="font-medium text-sm">{t.projectName}</p>
            <ItemList title="Accomplishments" items={t.accomplishments} />
            <TaskList title="New tasks" items={t.newTasks} />
            <ItemList title="Blockers" items={t.blockers} />
          </div>
        ))
      )}
    </Card>
  );
};

export default MeetingSummaryView;
