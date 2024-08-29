import { PersonRelationship } from "@/helpers/person/relationships";
import { differenceInYears, format } from "date-fns";
import { capitalize } from "lodash";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { FaCross } from "react-icons/fa";
import { LiaRingSolid } from "react-icons/lia";

type RelationTextProps = {
  relationship: PersonRelationship;
  deleteRelation: () => void;
  startEditing: () => void;
};

const RelationText: FC<RelationTextProps> = ({
  deleteRelation,
  startEditing,
  relationship: { nameOfRelationship, relatedPerson, anniversary, endDate },
}) => (
  <div className="space-x-1">
    <span className="font-semibold">{capitalize(nameOfRelationship)}:</span>
    <Link
      className="text-blue-400 hover:text-blue-600 no-underline hover:underline hover:underline-offset-2"
      href={`/people/${relatedPerson?.id}`}
    >
      {relatedPerson?.name}
    </Link>
    {endDate ? (
      <span>
        {(nameOfRelationship === "child" ||
          nameOfRelationship === "parent") && (
          <FaCross className="w-[0.7rem] h-[0.7rem] inline-block -translate-y-0.5" />
        )}
        {format(endDate, "PP")}
      </span>
    ) : (
      anniversary && (
        <>
          <span>
            {(nameOfRelationship === "child" ||
              nameOfRelationship === "parent") &&
              "*"}
            {nameOfRelationship === "spouse" && (
              <LiaRingSolid className="w-3 h-3 inline-block -translate-y-0.5" />
            )}
            {format(anniversary, "PPP")}
          </span>
          <span className="font-semibold">
            {differenceInYears(new Date(), anniversary)} years
          </span>
        </>
      )
    )}
    <Edit
      className="h-5 w-5 text-muted-foreground hover:text-primary inline-block"
      onClick={startEditing}
    />
    <Trash2
      className="h-5 w-5 text-muted-foreground hover:text-primary inline-block"
      onClick={deleteRelation}
    />
  </div>
);

export default RelationText;
