import { FC } from "react";

type MetaDataProps = {
  created: Date;
  updated?: Date;
};

const dateTimeOptions: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
};

const makeLocaleString = (date: Date) =>
  date.toLocaleDateString(undefined, dateTimeOptions);

const getUpdatedAtTime = ({ created, updated }: MetaDataProps) =>
  `Created: ${makeLocaleString(created)} ${
    !updated
      ? ""
      : updated.getTime() - created.getTime() < 1000 * 60
        ? ""
        : ` – Updated on: ${makeLocaleString(updated)}`
  }`;

const MetaData: FC<Partial<MetaDataProps>> = ({ created, updated }) => {
  return (
    <div className="text-muted-foreground mt-1 ml-2">
      <small>{created && getUpdatedAtTime({ created, updated })}</small>
    </div>
  );
};

export default MetaData;
