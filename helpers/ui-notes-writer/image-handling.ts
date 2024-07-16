import { EditorView } from "@tiptap/pm/view";
import { getUrl, uploadData } from "aws-amplify/storage";

const dispatchImage = (view: EditorView, url: string, fileName: string) => {
  const { schema } = view.state;
  const { tr } = view.state;
  const pos = view.state.selection.from;
  tr.insert(pos, schema.nodes.hardBreak.create());
  tr.insert(pos + 1, schema.nodes.paragraph.create());
  tr.insert(
    pos + 2,
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
  view: EditorView
) => {
  const file = item.getAsFile();
  if (!file) return false;
  const fileName = `${crypto.randomUUID()}-${file.name}`;

  dispatchImage(view, URL.createObjectURL(file), fileName);

  const { path: s3Path } = await uploadData({
    path: ({ identityId }) => `user-files/${identityId}/${fileName}`,
    data: file,
    options: {
      contentType: file.type,
    },
  }).result;

  const { url, expiresAt } = await getUrl({ path: s3Path });
  updateImageSrc(
    view,
    url.toString(),
    s3Path,
    expiresAt.toISOString(),
    fileName
  );
  return true;
};
