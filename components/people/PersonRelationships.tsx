import { PersonRelationship } from "@/helpers/person/relationships";
import { differenceInYears } from "date-fns";
import { capitalize } from "lodash";
import { PlusCircle } from "lucide-react";
import { FC, useState } from "react";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import LoadingAccordionItem from "../ui-elements/accordion/LoadingAccordionItem";
import { Button } from "../ui/button";
import RelationEdit from "./relations/relation-edit";
import RelationText from "./relations/relation-text";
import SubRelationships from "./relations/sub-relation-text";

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
}) =>
  !ownPersonId || !relationships ? (
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

        <SubRelationships
          ownPersonId={ownPersonId}
          relations={relationships}
          updateRelationship={updateRelationship}
        />
      </div>
    </DefaultAccordionItem>
  );

export default PersonRelationships;
