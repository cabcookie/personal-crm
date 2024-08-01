import { diffCalDays } from "@/helpers/functional";
import { format } from "date-fns";
import { flow } from "lodash/fp";
import { FC } from "react";

type CompareCrmDataProps = {
  label: string;
  importedValue?: string | number | Date;
  originalValue?: string | number | Date;
};

const CompareCrmData: FC<CompareCrmDataProps> = ({
  label,
  importedValue,
  originalValue,
}) =>
  ((importedValue === undefined && originalValue !== undefined) ||
    (importedValue !== undefined && originalValue === undefined) ||
    (((typeof importedValue === "string" &&
      typeof originalValue === "string") ||
      (typeof importedValue === "number" &&
        typeof originalValue === "number")) &&
      importedValue !== originalValue) ||
    (importedValue instanceof Date &&
      originalValue instanceof Date &&
      flow(diffCalDays(importedValue), Math.abs)(originalValue) > 3)) && (
    <div>
      <span className="font-semibold">{label}: </span>
      New:{" "}
      <span className="text-destructive">
        {importedValue instanceof Date
          ? format(importedValue, "PP")
          : importedValue}
      </span>{" "}
      (Original:{" "}
      {!originalValue
        ? "empty"
        : originalValue instanceof Date
        ? format(originalValue, "PP")
        : originalValue}
      )
    </div>
  );

export default CompareCrmData;
