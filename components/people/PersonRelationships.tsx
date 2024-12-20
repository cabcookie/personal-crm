import { PersonRelationship } from "@/helpers/person/relationships";
import { differenceInYears } from "date-fns";
import { capitalize } from "lodash";
import { FC } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import LoadingAccordionItem from "../ui-elements/accordion/LoadingAccordionItem";
import PersonRelationshipShowEdit from "./PersonRelationshipShowEdit";
import SubRelationships from "./relations/sub-relation-text";

type PersonRelationshipsProps = {
  ownPersonId?: string;
  relationships?: PersonRelationship[];
  updateRelationship: (
    relationship: Partial<PersonRelationship> & { id: string }
  ) => Promise<string | undefined>;
  deleteRelationship: (id: string) => Promise<string | undefined>;
};

const validRelations = ({
  nameOfRelationship,
  relatedPerson,
  endDate,
}: PersonRelationship) =>
  !!nameOfRelationship && !!relatedPerson?.name && !endDate;

const relationText = ({
  nameOfRelationship,
  relatedPerson,
  anniversary,
}: PersonRelationship) =>
  `${capitalize(nameOfRelationship)}: ${relatedPerson?.name}${
    !anniversary ? "" : ` (${differenceInYears(new Date(), anniversary)}y)`
  }`;

const PersonRelationships: FC<PersonRelationshipsProps> = ({
  ownPersonId,
  relationships,
  updateRelationship,
  deleteRelationship,
}) => {
  const saveChanges = async (
    relation: Partial<PersonRelationship> & { id: string }
  ) => {
    await updateRelationship(relation);
  };

  return !ownPersonId || !relationships ? (
    <LoadingAccordionItem
      value="loading-relations"
      sizeTitle="lg"
      sizeSubtitle="xl"
    />
  ) : (
    <DefaultAccordionItem
      value="relationships"
      triggerTitle="Relations"
      triggerSubTitle={relationships.filter(validRelations).map(relationText)}
    >
      <div className="space-y-4">
        <PersonRelationshipShowEdit updateRelationship={saveChanges} />

        {relationships.map((r) => (
          <PersonRelationshipShowEdit
            key={r.id}
            relationship={r}
            updateRelationship={saveChanges}
            deleteRelationship={deleteRelationship}
          />
        ))}

        <SubRelationships
          ownPersonId={ownPersonId}
          relations={relationships}
          updateRelationship={updateRelationship}
        />
      </div>
    </DefaultAccordionItem>
  );
};

export default PersonRelationships;
