import usePeople from "@/api/usePeople";
import {
  PersonRelationship,
  RELATIONSHIP_TYPES,
  RELATIONSHIPS,
  TRelationshipTypes,
} from "@/helpers/person/relationships";
import { Loader2 } from "lucide-react";
import { FC, useMemo, useState } from "react";
import DateSelector from "../../ui-elements/selectors/date-selector";
import PeopleSelector from "../../ui-elements/selectors/people-selector";
import RelationshipSelector from "../../ui-elements/selectors/relationship-selector";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";

type RelationEditProps = {
  relationship: PersonRelationship;
  updateRelationship: (relationship: PersonRelationship) => void;
  saveChanges: () => void;
  abortChanges: () => void;
};

const RelationEdit: FC<RelationEditProps> = ({
  updateRelationship,
  saveChanges,
  abortChanges,
  relationship,
}) => {
  const { people } = usePeople();
  const [isSaving, setIsSaving] = useState(false);

  const relationType = useMemo(
    () =>
      RELATIONSHIPS.find((r) => r.name === relationship.nameOfRelationship) ??
      RELATIONSHIPS.find(
        (r) => r.nameOfOtherDirection === relationship.nameOfRelationship
      ),
    [relationship.nameOfRelationship]
  );
  const handlePersonUpdate = async (personId: string | null) => {
    if (!personId) return;
    await updateRelationship({
      ...relationship,
      relatedPerson: {
        id: personId,
        name: people?.find((p) => p.id === personId)?.name ?? "",
      },
    });
  };

  const handleSelectRelationship = async (selected: string | null) => {
    if (!selected) return;
    if (!RELATIONSHIP_TYPES.includes(selected as TRelationshipTypes)) return;
    await updateRelationship({
      ...relationship,
      nameOfRelationship: selected as TRelationshipTypes,
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    await saveChanges();
    setIsSaving(false);
  };

  return (
    <div className="space-y-2">
      <div className="text-base font-semibold">
        {relationship.id === "NEW" ? "Create" : "Edit"} Relationship:
      </div>

      <RelationshipSelector
        value={relationship.nameOfRelationship}
        onChange={handleSelectRelationship}
      />

      <PeopleSelector
        value={relationship.relatedPerson?.id ?? ""}
        onChange={handlePersonUpdate}
        allowNewPerson
      />

      {relationType?.hasAnniversary && (
        <div className="space-y-1">
          <Label>{relationship.nameOfAnniversary}</Label>
          <DateSelector
            date={relationship.anniversary}
            setDate={(date: Date) =>
              updateRelationship({ ...relationship, anniversary: date })
            }
            captionLayout="dropdown"
          />
        </div>
      )}

      {relationType?.hasEndDate && (
        <div>
          <Label>Till</Label>
          <DateSelector
            date={relationship.endDate}
            setDate={(date: Date) =>
              updateRelationship({ ...relationship, endDate: date })
            }
          />
        </div>
      )}

      <div className="flex flex-row gap-2">
        <Button
          size="sm"
          className="gap-1"
          onClick={handleSave}
          disabled={!relationship.nameOfRelationship || isSaving}
        >
          {isSaving && <Loader2 className="w-5 h-5 animate-spin" />}
          {isSaving ? "Saving…" : "Done"}
        </Button>

        {abortChanges && (
          <Button size="sm" onClick={abortChanges} variant="outline">
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

export default RelationEdit;
