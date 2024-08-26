import { Button } from "@/components/ui/button";
import { truncateMiddle } from "@/helpers/functional";
import useKeyDown from "@/helpers/keyboard-events/useKeyDown";
import { Editor, getMarkRange, getMarkType } from "@tiptap/core";
import { truncate } from "lodash";
import Link from "next/link";
import type { FC } from "react";

type ViewLinkMenuContentProps = {
  editor: Editor;
  onCancel: () => void;
  onEdit: () => void;
  onRemove: () => void;
};

const ViewLinkMenuContent: FC<ViewLinkMenuContentProps> = ({
  editor,
  onCancel,
  onEdit,
  onRemove,
}) => {
  const linkRange = getMarkRange(
    editor.state.selection.$to,
    getMarkType("link", editor.schema)
  );
  const linkText = linkRange
    ? editor.state.doc.textBetween(linkRange.from, linkRange.to)
    : "";
  const currentHref =
    (editor.getAttributes("link").href as string | undefined) ?? "";
  useKeyDown("Escape", onCancel);

  return (
    <div className="space-y-2 text-sm">
      <div>{truncate(linkText, { length: 50, omission: "…" })}</div>

      <div>
        <Link
          href={currentHref}
          target="_blank"
          rel="noopener"
          className="text-blue-400 hover:text-blue-600 hover:underline hover:underline-offset-2"
        >
          {truncateMiddle(currentHref, 50)}
        </Link>
      </div>

      <div className="flex justify-between">
        <Button size="sm" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={onRemove}>
          Remove
        </Button>
      </div>
    </div>
  );
};

export default ViewLinkMenuContent;
