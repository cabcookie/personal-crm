import { PersonRelationship } from "@/api/usePerson";
import { differenceInYears } from "date-fns";
import { capitalize } from "lodash";
import { PlusCircle } from "lucide-react";
import { FC, useState } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import LoadingAccordionItem from "../ui-elements/accordion/LoadingAccordionItem";
import { Button } from "../ui/button";
import RelationEdit from "./relations/relation-edit";
import RelationText from "./relations/relation-text";

type PersonRelationshipHelperProps = {
  relationship: PersonRelationship;
  updateRelationship: (
    relationship: Partial<PersonRelationship> & { id: string }
  ) => Promise<string | undefined>;
  deleteRelationship: (id: string) => Promise<string | undefined>;
};

const PersonRelationshipHelper: FC<PersonRelationshipHelperProps> = ({
  updateRelationship,
  deleteRelationship,
  relationship,
}) => {
  const [isEditing, setIsEditing] = useState(!relationship.nameOfRelationship);

  return !isEditing ? (
    <RelationText
      relationship={relationship}
      deleteRelation={() => deleteRelationship(relationship.id)}
      startEditing={() => setIsEditing(true)}
    />
  ) : (
    <RelationEdit
      relationship={relationship}
      updateRelationship={updateRelationship}
      confirmChanges={() => setIsEditing(false)}
    />
  );
};

type PersonRelationshipsProps = {
  relationships?: PersonRelationship[];
  updateRelationship: (
    relationship: Partial<PersonRelationship> & { id: string }
  ) => Promise<string | undefined>;
  deleteRelationship: (id: string) => Promise<string | undefined>;
};

const PersonRelationships: FC<PersonRelationshipsProps> = ({
  relationships,
  updateRelationship,
  deleteRelationship,
}) =>
  !relationships ? (
    <LoadingAccordionItem
      value="loading-relations"
      sizeTitle="lg"
      sizeSubtitle="xl"
    />
  ) : (
    <DefaultAccordionItem
      value="relationships"
      triggerTitle="Relations"
      triggerSubTitle={relationships
        .filter(
          (r) => !!r.nameOfRelationship && !!r.relatedPerson?.name && !r.endDate
        )
        .map(
          (r) =>
            `${capitalize(r.nameOfRelationship)}: ${r.relatedPerson?.name}${
              !r.anniversary
                ? ""
                : ` (${differenceInYears(new Date(), r.anniversary)}y)`
            }`
        )}
    >
      <div className="space-y-4 px-1 md:px-2">
        <Button
          size="sm"
          className="gap-1"
          onClick={() => updateRelationship({ id: "NEW" })}
        >
          <PlusCircle className="w-4 h-4" />
          Relation
        </Button>

        {relationships.map((r) => (
          <PersonRelationshipHelper
            key={r.id}
            relationship={r}
            updateRelationship={updateRelationship}
            deleteRelationship={deleteRelationship}
          />
        ))}
      </div>
    </DefaultAccordionItem>
  );

export default PersonRelationships;
