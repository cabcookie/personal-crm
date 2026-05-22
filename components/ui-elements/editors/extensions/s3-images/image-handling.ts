import { toISODateTimeString } from "@/helpers/functional";
import { uploadFileToS3 } from "@/helpers/s3/upload-files";
import { Editor } from "@tiptap/core";
import { TextSelection } from "@tiptap/pm/state";
import { EditorView } from "@tiptap/pm/view";

const freshlyPastedBlockIds = new Set<string>();

export const consumeFreshlyPastedBlockId = (blockId: string | null) => {
  if (!blockId) return false;
  return freshlyPastedBlockIds.delete(blockId);
};

export const clearFreshlyPastedBlockIds = () => {
  freshlyPastedBlockIds.clear();
};

let userScrollListenersAttached = false;
const attachUserScrollListeners = () => {
  if (userScrollListenersAttached) return;
  if (typeof window === "undefined") return;
  userScrollListenersAttached = true;
  const cancel = () => clearFreshlyPastedBlockIds();
  window.addEventListener("wheel", cancel, { passive: true, capture: true });
  window.addEventListener("touchmove", cancel, {
    passive: true,
    capture: true,
  });
};

const dispatchImage = (view: EditorView, url: string, fileName: string) => {
  attachUserScrollListeners();
  const { schema, selection, tr } = view.state;
  const blockId = crypto.randomUUID();
  freshlyPastedBlockIds.add(blockId);
  const imageNode = schema.nodes.s3image.create({
    src: url,
    fileKey: fileName,
    blockId,
  });

  const $from = selection.$from;
  const parent = $from.parent;
  const isInTextBlock = parent.isTextblock && $from.depth >= 1;

  if (!isInTextBlock) {
    tr.insert(selection.from, imageNode);
    view.dispatch(tr.scrollIntoView());
    return;
  }

  const emptyParagraph = schema.nodes.paragraph.create();
  let cursorPos: number;

  if (parent.content.size === 0) {
    const start = $from.before();
    const end = $from.after();
    tr.replaceWith(start, end, [imageNode, emptyParagraph]);
    cursorPos = start + imageNode.nodeSize + 1;
  } else {
    const insertPos = $from.after();
    tr.insert(insertPos, [imageNode, emptyParagraph]);
    cursorPos = insertPos + imageNode.nodeSize + 1;
  }

  tr.setSelection(TextSelection.create(tr.doc, cursorPos));
  view.dispatch(tr.scrollIntoView());
};

const updateImageSrc = (
  view: EditorView,
  url: string,
  s3Key: string,
  expiresAt: string,
  fileName: string
) => {
  const { state, dispatch } = view;
  const { tr, doc } = state;
  let pos: number | null = null;
  let blockId: string | null = null;

  doc.descendants((node, nodePos) => {
    if (node.type.name === "s3image" && node.attrs.fileKey === fileName) {
      pos = nodePos;
      blockId = node.attrs.blockId;
      return false;
    }
    return true;
  });

  if (pos !== null) {
    const transaction = tr.setNodeMarkup(pos, undefined, {
      src: url,
      s3Key,
      expiresAt,
      fileKey: fileName,
      blockId,
    });
    dispatch(transaction);
  }
};

export const handlePastingImage = async (
  item: DataTransferItem,
  view: EditorView,
  editor: Editor | null
) => {
  if (!editor) return;
  editor?.chain().focus().setParagraph().run();
  const file = item.getAsFile();
  if (!file) return false;

  dispatchImage(editor?.view, URL.createObjectURL(file), file.name);

  const { url, expiresAt, s3Path } = await uploadFileToS3(
    file,
    "user-files/${identityId}/${filename}"
  );

  updateImageSrc(
    view,
    url.toString(),
    s3Path,
    toISODateTimeString(expiresAt),
    file.name
  );
  return true;
};
