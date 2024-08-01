import { FC } from "react";

type LabelDataProps = {
  label?: string;
  data?: string;
};

const LabelData: FC<LabelDataProps> = ({ label, data }) =>
  data && (
    <div>
      {label && <span className="font-semibold">{label}: </span>}
      {data}
    </div>
  );

export default LabelData;
