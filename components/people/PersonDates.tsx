import { Person } from "@/api/usePerson";
import { addYears, format, subYears } from "date-fns";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import LoadingAccordionItem from "../ui-elements/accordion/LoadingAccordionItem";
import DateSelector from "../ui-elements/selectors/date-selector";
import { Label } from "../ui/label";

type PersonDateHelperProps = {
  label: string;
  value?: Date;
  updateDateFn: (date: Date) => Promise<string | undefined>;
};

const PersonDateHelper: FC<PersonDateHelperProps> = ({
  label,
  value,
  updateDateFn,
}) => (
  <div>
    <Label className="font-semibold">{label}</Label>
    <DateSelector
      date={value}
      setDate={updateDateFn}
      captionLayout="dropdown"
      startMonth={subYears(new Date(), 120)}
      endMonth={addYears(new Date(), 1)}
    />
  </div>
);

type PersonDatesProps = {
  person?: Person;
  updateDateFn: (dates: {
    dateOfBirth?: Date;
    dateOfDeath?: Date;
  }) => Promise<string | undefined>;
};

const PersonDates: FC<PersonDatesProps> = ({ person, updateDateFn }) =>
  !person ? (
    <LoadingAccordionItem
      value="loading-dates"
      sizeTitle="xl"
      sizeSubtitle="xs"
    />
  ) : (
    <DefaultAccordionItem
      value="person-dates"
      triggerTitle="Person's dates"
      isVisible
      triggerSubTitle={[
        person.dateOfBirth &&
          `Date of birth: ${format(person.dateOfBirth, "PPP")}`,
        person.dateOfDeath &&
          `Date of death: ${format(person.dateOfDeath, "PPP")}`,
      ]}
    >
      <div className="space-y-4 px-1 md:px-2">
        <PersonDateHelper
          label="Date of Birth"
          value={person.dateOfBirth}
          updateDateFn={(date: Date) => updateDateFn({ dateOfBirth: date })}
        />
        <PersonDateHelper
          label="Date of Death"
          value={person.dateOfDeath}
          updateDateFn={(date: Date) => updateDateFn({ dateOfDeath: date })}
        />
      </div>
    </DefaultAccordionItem>
  );

export default PersonDates;
