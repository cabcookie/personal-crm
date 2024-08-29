import {
  PersonContactDetailsUpdateProps,
  PersonDetail,
  TPersonDetailTypes,
} from "@/helpers/person/details";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import PersonContactDetailsForm from "./PersonContactDetailsForm";

type PersonContactDetailProps = {
  personDetail: PersonDetail;
  detailType?: TPersonDetailTypes;
  personName: string;
  onChange: (props: PersonContactDetailsUpdateProps) => void;
  onDelete: (contactDetailId: string) => void;
};

const PersonContactDetail: FC<PersonContactDetailProps> = ({
  personDetail,
  detailType,
  personName,
  onChange,
  onDelete,
}) =>
  detailType && (
    <div className="my-2">
      <div className="flex flex-row gap-2 items-center">
        <detailType.Icon className="w-5 h-5" />
        {detailType.buildLink ? (
          <Link
            href={detailType.buildLink(personDetail.detail)}
            target={
              !detailType.buildLink(personDetail.detail).startsWith("mailto:")
                ? "_blank"
                : undefined
            }
            className="text-blue-600 hover:underline underline-offset-2 font-semibold"
          >
            {!detailType.buildLabel
              ? personDetail.detail
              : detailType.buildLabel(personDetail.detail)}
          </Link>
        ) : (
          <div className="font-semibold">
            {!detailType.buildLabel
              ? personDetail.detail
              : detailType.buildLabel(personDetail.detail)}
          </div>
        )}
        <PersonContactDetailsForm
          personName={personName}
          onChange={onChange}
          personDetail={personDetail}
        />
        <Trash2
          className="w-5 h-5 text-muted-foreground hover:text-primary"
          onClick={() => onDelete(personDetail.id)}
        />
      </div>
      <div className="text-muted-foreground">
        <small>{detailType.formLabel}</small>
      </div>
    </div>
  );

export default PersonContactDetail;
