import { type FC } from "react";
import { type Note } from "@/helpers/history/activity";

interface Props {
  notes?: Note[] | null;
}

const HistoryNotes: FC<Props> = ({ notes }) => (
  <div className="flex flex-col gap-3">
    <h2 className="text-lg font-semibold">Project Notes</h2>
    {notes?.map((n) => (
      <div key={n.id} className="flex flex-col gap-1">
        <h3 className="font-semibold">{n.label}</h3>
        {n.notes?.split("\n").map((line, idx) => (
          <p key={idx}>{line}</p>
        ))}
      </div>
    ))}
  </div>
);

export default HistoryNotes;
