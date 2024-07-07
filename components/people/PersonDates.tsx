import { Person } from "@/api/usePerson";
import { format } from "date-fns";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
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
  person: Person;
  accordionSelectedValue?: string;
};

const PersonDates: FC<PersonDatesProps> = ({
  person: { dateOfBirth, dateOfDeath },
  accordionSelectedValue,
}) => {
  return (
    <DefaultAccordionItem
      value="person-dates"
      triggerTitle="Person's dates"
      accordionSelectedValue={accordionSelectedValue}
      isVisible
      triggerSubTitle={[
        dateOfBirth && `Date of birth: ${format(dateOfBirth, "PPP")}`,
        dateOfDeath && `Date of death: ${format(dateOfDeath, "PPP")}`,
      ]}
    >
      {dateOfBirth && (
        <PersonDateHelper
          id="date-of-birth"
          label="Date of Birth"
          value={dateOfBirth}
        />
      )}
      {dateOfDeath && (
        <PersonDateHelper
          id="date-of-death"
          label="Date of Death"
          value={dateOfDeath}
        />
      )}
    </DefaultAccordionItem>
  );
};

export default PersonDates;
