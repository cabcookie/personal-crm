import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useKeyDown from "@/helpers/keyboard-events/useKeyDown";
import { Editor, getMarkRange, getMarkType } from "@tiptap/core";
import encodeurl from "encodeurl";
import { FC, useCallback, useRef, useState } from "react";

type EditLinkMenuContentProps = {
  editor: Editor;
  onCancel: () => void;
  onSave: ({ text, link }: { text: string; link: string }) => void;
};

const EditLinkMenuContent: FC<EditLinkMenuContentProps> = ({
  editor,
  onCancel,
  onSave,
}) => {
  const existingHref = editor.isActive("link")
    ? (editor.getAttributes("link").href as string)
    : "";
  const linkRange = getMarkRange(
    editor.state.selection.$from,
    getMarkType("link", editor.schema)
  );
  const linkText = linkRange
    ? editor.state.doc.textBetween(linkRange.from, linkRange.to)
    : "";
  const selectedText = editor.state.doc.textBetween(
    editor.state.selection.$from.pos,
    editor.state.selection.$to.pos
  );
  // If we're on a link, we'll use the full link text, otherwise we'll fall back
  // to the selected text
  const initialText = linkText || selectedText;

  const [textValue, setTextValue] = useState(initialText);
  const [hrefValue, setHrefValue] = useState(existingHref);

  const textRef = useRef<HTMLInputElement | null>(null);
  const hrefRef = useRef<HTMLInputElement | null>(null);

  // If there's already a link where the user has clicked, they're "editing",
  // otherwise the menu has been brought up to add a new link
  const isNewLink = !existingHref;
  const editMenuTitle = isNewLink ? "Add link" : "Edit link";

  useKeyDown("Escape", onCancel);

  const formatHref = useCallback(() => {
    if (!hrefRef.current) return;
    const currentHrefValue = (() => {
      const current = hrefRef.current.value.trim();
      if (
        current &&
        !current.startsWith("http://") &&
        !current.startsWith("https://") &&
        !current.startsWith("mailto:") &&
        !current.startsWith("tel:")
      )
        return `https://${current}`;
      return current;
    })();
    setHrefValue(encodeurl(currentHrefValue));
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsSubmitting(true);
        const text = textRef.current?.value ?? "";
        const href = hrefRef.current?.value ?? "";
        onSave({ text, link: href });
        setIsSubmitting(false);
      }}
      autoComplete="off"
    >
      <div className="space-y-2">
        <h4 className="font-bold text-lg">{editMenuTitle}</h4>
        <div className="space-y-1">
          <Label>Text</Label>
          <Input
            ref={textRef}
            value={textValue}
            onChange={(event) => setTextValue(event.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-1">
          <Label>Link</Label>
          <Input
            ref={hrefRef}
            value={hrefValue}
            onChange={(event) => setHrefValue(event.target.value)}
            disabled={isSubmitting}
            onBlur={formatHref}
            onKeyDown={(event) => {
              if (event.key === "Enter") formatHref();
            }}
          />
        </div>
        <div className="flex justify-between">
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="sm" type="submit">
            Save
          </Button>
        </div>
      </div>
    </form>
  );
};

export default EditLinkMenuContent;
