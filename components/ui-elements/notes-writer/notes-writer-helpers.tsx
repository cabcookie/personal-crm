import { Descendant, BaseEditor, Node } from "slate";
import { ReactEditor } from "slate-react";
import { HistoryEditor } from "slate-history";

export type ParagraphElement = {
  type: "paragraph";
  children: FormattedText[];
};

export type CustomElement = ParagraphElement;

export type FormattedText = {
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  text: string;
};

export type CustomEditor = BaseEditor &
  ReactEditor &
  HistoryEditor;

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: FormattedText;
  }
}

const initialValue: ParagraphElement = {
  type: "paragraph",
  children: [{ text: "" }],
};

export const serialize = (descendants: Descendant[]) => () => descendants.map((d) => Node.string(d)).join("\n");

export const deserialize = (text: string) => text === "" ? [initialValue] : text.split("\n").map((line): Descendant => ({ type: "paragraph", children: [{text: line}]}));
