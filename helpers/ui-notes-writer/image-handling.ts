import { Editor } from "@tiptap/core";
import { EditorView } from "@tiptap/pm/view";
import { uploadFileToS3 } from "../s3/upload-filtes";

const dispatchImage = (view: EditorView, url: string, fileName: string) => {
  const { schema } = view.state;
  const { tr } = view.state;
  const pos = view.state.selection.from;
  tr.insert(
    pos,
    schema.nodes.s3image.create({
      src: url,
      fileKey: fileName,
    })
  );
  view.dispatch(tr);
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

  doc.descendants((node, nodePos) => {
    if (node.type.name === "s3image" && node.attrs.fileKey === fileName) {
      pos = nodePos;
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
    expiresAt.toISOString(),
    file.name
  );
  return true;
};
