import { type FC } from "react";
import { Person } from "@/helpers/history/person";

interface Props {
  people?: Person[] | null;
}

const HistoryPeopleRoles: FC<Props> = ({ people }) => (
  <div className="flex flex-col gap-3">
    <h2 className="text-lg font-semibold">People and their roles</h2>
    {people?.map((p) => (
      <div key={p.id}>
        <div>{p.name}</div>
        {p.positions.map((pos, idx) => (
          <div key={idx} className="text-xs">
            {pos.position}
          </div>
        ))}
      </div>
    ))}
  </div>
);

export default HistoryPeopleRoles;
