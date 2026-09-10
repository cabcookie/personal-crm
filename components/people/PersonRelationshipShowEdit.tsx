import { PersonRelationship } from "@/helpers/person/relationships";
import { PlusCircle } from "lucide-react";
import { FC, useState } from "react";
import { Button } from "../ui/button";
import RelationEdit from "./relations/relation-edit";
import RelationText from "./relations/relation-text";

interface PersonRelationshipShowEditProps {
  relationship?: PersonRelationship;
  updateRelationship: (
    relationship: Partial<PersonRelationship> & { id: string }
  ) => void;
  deleteRelationship?: (id: string) => Promise<string | undefined>;
}

export const emptyRelation = {
  id: "NEW",
  direction: "from",
} as PersonRelationship;

const PersonRelationshipShowEdit: FC<PersonRelationshipShowEditProps> = ({
  updateRelationship,
  deleteRelationship,
  relationship = emptyRelation,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [relation, setRelation] = useState(relationship);
  const [lastRelationship, setLastRelationship] = useState(relationship);

  // Adjusting state during render is React's documented alternative to
  // syncing it in an effect, and avoids the extra render pass.
  if (lastRelationship !== relationship) {
    setLastRelationship(relationship);
    setRelation(relationship);
  }

  const saveChanges = async () => {
    await updateRelationship(relation);
    if (relationship.id === "NEW") setRelation(emptyRelation);
    setIsEditing(false);
  };

  const abortChanges = () => {
    if (relationship.id === "NEW") setRelation(emptyRelation);
    setIsEditing(false);
  };

  return (
    <>
      {relationship.id === "NEW" && !isEditing && (
        <Button size="sm" className="gap-1" onClick={() => setIsEditing(true)}>
          <PlusCircle className="w-4 h-4" />
          Relation
        </Button>
      )}

      {isEditing ? (
        <RelationEdit
          relationship={relation}
          updateRelationship={setRelation}
          saveChanges={saveChanges}
          abortChanges={abortChanges}
        />
      ) : (
        relationship.id !== "NEW" && (
          <RelationText
            relationship={relationship}
            deleteRelation={() => deleteRelationship?.(relationship.id)}
            startEditing={() => setIsEditing(true)}
          />
        )
      )}
    </>
  );
};

export default PersonRelationshipShowEdit;
