import { mergeAttributes } from "@tiptap/core";
import { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { NodeView } from "@tiptap/pm/view";
import { Node, NodeViewRenderer } from "@tiptap/react";
import { getUrl } from "aws-amplify/storage";
import { isFuture } from "date-fns";

const assignUrlToDom = async (node: ProseMirrorNode, img: HTMLImageElement) => {
  console.log(node.attrs);
  if (!node.attrs.s3Key) {
    img.setAttribute("src", node.attrs.src);
    img.setAttribute("class", "animate-pulseOpacity");
    return;
  }
  if (node.attrs.expiresAt && isFuture(new Date(node.attrs.expiresAt))) {
    img.setAttribute("src", node.attrs.src);
    img.setAttribute("expiresAt", node.attrs.expiresAt);
    img.setAttribute("data-s3-key", node.attrs.s3Key);
    img.setAttribute("class", "");
    return;
  }
  const { url, expiresAt } = await getUrl({ path: node.attrs.s3Key });
  img.setAttribute("src", url.toString());
  img.setAttribute("expiresAt", expiresAt.toISOString());
  img.setAttribute("data-s3-key", node.attrs.s3Key);
  img.setAttribute("class", "");
};

const S3ImageRenderer: NodeViewRenderer = ({ node }): NodeView => {
  const dom = document.createElement("img");
  assignUrlToDom(node, dom);

  return {
    dom,
    update: (updatedNode) => {
      if (updatedNode.type.name !== "s3image") return false;
      assignUrlToDom(updatedNode, dom);
      return true;
    },
  };
};

const S3ImageExtension = Node.create({
  name: "s3image",
  inline: false,
  group: "block",
  draggable: true,
  addAttributes: () => ({
    src: {
      default: null,
    },
    s3Key: {
      default: null,
    },
    expiresAt: {
      default: null,
    },
  }),
  parseHTML: () => [
    {
      tag: "img[src]",
    },
  ],
  renderHTML: ({ HTMLAttributes }) => ["img", mergeAttributes(HTMLAttributes)],
  addNodeView: () => S3ImageRenderer,
});

export default S3ImageExtension;
