import { flow, replace } from "lodash/fp";
import {
  AtSign,
  Building,
  ExternalLink,
  Instagram,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react";

export type TDetailLabel =
  | "linkedIn"
  | "phonePrivate"
  | "phoneWork"
  | "emailPrivate"
  | "emailWork"
  | "salesforce"
  | "instagram"
  | "amazonalias";

export type TPersonDetailTypes = {
  fieldLabel: TDetailLabel;
  formLabel: string;
  type: "url" | "phone" | "email" | "string";
  buildLabel?: (label: string) => string;
  buildLink?: (label: string) => string;
  Icon: typeof Phone;
};

export const personDetailsLabels: TPersonDetailTypes[] = [
  {
    fieldLabel: "linkedIn",
    formLabel: "LinkedIn profile",
    type: "url",
    buildLabel: flow(
      decodeURIComponent,
      replace(
        /^(https?:\/\/)?(www\.)?linkedin\.com\/(in\/[a-zA-Z0-9-öäüÖÄÜß]+)\/?$/,
        "$3"
      )
    ),
    buildLink: (label) => label,
    Icon: Linkedin,
  },
  {
    fieldLabel: "phonePrivate",
    formLabel: "Phone (private)",
    type: "phone",
    buildLink: (label) => `tel:${label}`,
    Icon: Phone,
  },
  {
    fieldLabel: "phoneWork",
    formLabel: "Phone (work)",
    type: "phone",
    buildLink: (label) => `tel:${label}`,
    Icon: Building,
  },
  {
    fieldLabel: "emailPrivate",
    formLabel: "Email (private)",
    type: "email",
    buildLink: (label) => `mailto:${label}`,
    Icon: Mail,
  },
  {
    fieldLabel: "emailWork",
    formLabel: "Email (Work)",
    type: "email",
    buildLink: (label) => `mailto:${label.toLowerCase()}`,
    Icon: Building,
  },
  {
    fieldLabel: "salesforce",
    formLabel: "Salesforce link",
    type: "url",
    Icon: ExternalLink,
  },
  {
    fieldLabel: "instagram",
    formLabel: "Instagram profile",
    type: "url",
    Icon: Instagram,
  },
  {
    fieldLabel: "amazonalias",
    formLabel: "Amazon Alias",
    type: "string",
    buildLink: (label) => `https://phonetool.amazon.com/users/${label}`,
    Icon: AtSign,
  },
] as const;

export type PersonContactDetailsUpdateProps =
  PersonContactDetailsCreateProps & { id: string };

export type PersonContactDetailsCreateProps = {
  label: string;
  detail: string;
};

export type PersonDetail = {
  id: string;
  label: string;
  detail: string;
};
