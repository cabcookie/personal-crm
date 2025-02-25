import { type FC } from "react";
import { AccountMapped } from "@/helpers/history/account";

interface Props {
  account: AccountMapped;
}

const HistoryLearnings: FC<Props> = ({ account }) => (
  <div className="flex flex-col gap-3">
    <h2 className="text-lg font-semibold">
      Learnings about the account and people
    </h2>
    {account.learnings.map(
      (intro) =>
        intro.learning && (
          <div key={intro.id} className="flex flex-col gap-1">
            <h3 className="font-semibold">{intro.label}</h3>
            {intro.learning
              ?.split("\n")
              .map((line, idx) => <p key={idx}>{line}</p>)}
          </div>
        )
    )}
  </div>
);

export default HistoryLearnings;
