import {
  PersonRelationship,
  RELATIONSHIP_TYPES,
  RELATIONSHIPS,
  TRelationshipTypes,
} from "@/helpers/person/relationships";
import { FC, useMemo } from "react";
import DateSelector from "../../ui-elements/selectors/date-selector";
import PeopleSelector from "../../ui-elements/selectors/people-selector";
import RelationshipSelector from "../../ui-elements/selectors/relationship-selector";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";

type RelationEditProps = {
  relationship: PersonRelationship;
  updateRelationship: (
    relationship: Partial<PersonRelationship> & { id: string }
  ) => Promise<string | undefined>;
  confirmChanges: () => void;
};

const RelationEdit: FC<RelationEditProps> = ({
  confirmChanges,
  updateRelationship,
  relationship: {
    id,
    nameOfAnniversary,
    nameOfRelationship,
    anniversary,
    endDate,
    relatedPerson,
  },
}) => {
  const relationType = useMemo(
    () =>
      RELATIONSHIPS.find((r) => r.name === nameOfRelationship) ??
      RELATIONSHIPS.find((r) => r.nameOfOtherDirection === nameOfRelationship),
    [nameOfRelationship]
  );
  const handlePersonUpdate = async (personId: string | null) => {
    if (!personId) return;
    await updateRelationship({ id, relatedPerson: { id: personId, name: "" } });
  };

  const handleSelectRelationship = async (selected: string | null) => {
    if (!selected) return;
    if (!RELATIONSHIP_TYPES.includes(selected as TRelationshipTypes)) return;
    await updateRelationship({
      id,
      nameOfRelationship: selected as TRelationshipTypes,
    });
  };

  return (
    <div className="space-y-2">
      <div className="text-base font-semibold">Edit Relationship:</div>
      <RelationshipSelector
        value={nameOfRelationship}
        onChange={handleSelectRelationship}
      />
      <PeopleSelector
        value={relatedPerson?.id ?? ""}
        onChange={handlePersonUpdate}
        allowNewPerson
      />
      {relationType?.hasAnniversary && (
        <div className="space-y-1">
          <Label>{nameOfAnniversary}</Label>
          <DateSelector
            date={anniversary}
            setDate={(date: Date) =>
              updateRelationship({ id, anniversary: date })
            }
            captionLayout="dropdown"
          />
        </div>
      )}
      {relationType?.hasEndDate && (
        <div>
          <Label>Till</Label>
          <DateSelector
            date={endDate}
            setDate={(date: Date) => updateRelationship({ id, endDate: date })}
          />
        </div>
      )}
      <Button
        size="sm"
        className="gap-1"
        onClick={confirmChanges}
        disabled={!nameOfRelationship}
      >
        Done
      </Button>
    </div>
  );
};

export default RelationEdit;
