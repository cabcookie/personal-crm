import { Person } from "@/api/usePerson";
import { format } from "date-fns";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import LoadingAccordionItem from "../ui-elements/accordion/LoadingAccordionItem";
import { Calendar } from "../ui/calendar";
import { Label } from "../ui/label";

type PersonDateHelperProps = {
  id?: string;
  label: string;
  value: Date;
};

const PersonDateHelper: FC<PersonDateHelperProps> = ({ id, label, value }) => (
  <div>
    <Label htmlFor={id} className="font-semibold">
      {label}
    </Label>
    <Calendar
      id={id}
      mode="single"
      defaultMonth={value}
      selected={value}
      className="w-[17.5rem]"
      disabled
      disableNavigation
    />
  </div>
);

type PersonDatesProps = {
  person?: Person;
};

const PersonDates: FC<PersonDatesProps> = ({ person }) =>
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
      {person.dateOfBirth && (
        <PersonDateHelper
          id="date-of-birth"
          label="Date of Birth"
          value={person.dateOfBirth}
        />
      )}
      {person.dateOfDeath && (
        <PersonDateHelper
          id="date-of-death"
          label="Date of Death"
          value={person.dateOfDeath}
        />
      )}
    </DefaultAccordionItem>
  );

export default PersonDates;
