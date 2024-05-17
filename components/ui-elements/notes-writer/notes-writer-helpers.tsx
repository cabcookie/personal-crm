import { Descendant, BaseEditor, Node, Editor, Element } from "slate";
import { ReactEditor, RenderElementProps, RenderLeafProps, useSelected } from "slate-react";
import { HistoryEditor } from "slate-history";
import isUrl from "is-url";
import { Transforms } from "slate";
import { Range } from "slate";

export const renderElement = (props: RenderElementProps) => <ElementRenderer {...props} />
export const renderLeaf = (props: RenderLeafProps) => <LeafRenderer {...props} />

const ElementRenderer = (props: RenderElementProps) => {
  switch (props.element.type) {
    case "link":
      return <LinkComponent {...props} />;
    default:
      return <div {...props} />
  }
};

const LeafRenderer = ({attributes, children, leaf}: RenderLeafProps) => {
  if (leaf.bold) {
    children = <strong {...attributes}>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em {...attributes}>{children}</em>;
  }

  if (leaf.code) {
    children = <code {...attributes}>{children}</code>;
  }

  return <span {...attributes}>{children}</span>;
};

type LinkElement = {
  type: 'link';
  url: string;
  children: Descendant[]
};

type ParagraphElement = {
  type: "paragraph";
  children: FormattedText[];
};

type CustomElement = ParagraphElement | LinkElement;

type FormattedText = {
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  text: string;
};

type CustomEditor = BaseEditor &
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

export const withInlines = (editor: CustomEditor) => {
  const { insertData, insertText, isInline, isElementReadOnly, isSelectable } =
    editor;

  editor.isInline = element =>
    ['link'].includes(element.type) || isInline(element);
  
  editor.isElementReadOnly = element =>
    isElementReadOnly(element);
  
  editor.isSelectable = element =>
    isSelectable(element);
  
  editor.insertText = (text) => {
    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertText(text);
    }
  }
  
  editor.insertData = data => {
    const text = data.getData('text/plain');
  
    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertData(data);
    }
  }
  
  return editor;
};

const isLinkActive = (editor: CustomEditor) => {
  const links = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link',
  })
  return !!links
}

const unwrapLink = (editor: CustomEditor) => {
  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link',
  })
}

const wrapLink = (editor: CustomEditor, url: string) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor)
  }

  const { selection } = editor
  const isCollapsed = selection && Range.isCollapsed(selection)
  const link: LinkElement = {
    type: 'link',
    url,
    children: isCollapsed ? [{ text: url }] : [],
  }

  if (isCollapsed) {
    Transforms.insertNodes(editor, link)
  } else {
    Transforms.wrapNodes(editor, link, { split: true })
    Transforms.collapse(editor, { edge: 'end' })
  }
}

// Put this at the start and end of an inline component to work around this Chromium bug:
// https://bugs.chromium.org/p/chromium/issues/detail?id=1249405
const InlineChromiumBugfix = () => (
  <span
    contentEditable={false}
    style={{fontSize: "0"}}
  >
    {String.fromCodePoint(160) /* Non-breaking space */}
  </span>
)

const LinkComponent = ({ attributes, children, element }: RenderElementProps) => {
  if (element.type !== "link") return <span {...attributes}>{children}</span>;

  return (
    <a
      {...attributes}
      href={element.url}
    >
      <InlineChromiumBugfix />
      {children}
      <InlineChromiumBugfix />
    </a>
  )
}
