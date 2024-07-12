import { cn } from "@/lib/utils";
import { mergeAttributes } from "@tiptap/core";
import { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { NodeView } from "@tiptap/pm/view";
import { Node, NodeViewRenderer } from "@tiptap/react";
import { getUrl } from "aws-amplify/storage";
import { isFuture } from "date-fns";

const assignUrlToDom = async (node: ProseMirrorNode, img: HTMLImageElement) => {
  const stdClasses = "rounded-md border-2 border-solid";
  if (!node.attrs.s3Key) {
    img.setAttribute("src", node.attrs.src);
    img.setAttribute("class", cn("animate-pulseOpacity", stdClasses));
    return;
  }
  if (node.attrs.expiresAt && isFuture(new Date(node.attrs.expiresAt))) {
    img.setAttribute("src", node.attrs.src);
    img.setAttribute("expiresAt", node.attrs.expiresAt);
    img.setAttribute("data-s3-key", node.attrs.s3Key);
    img.setAttribute("class", stdClasses);
    return;
  }
  const { url, expiresAt } = await getUrl({ path: node.attrs.s3Key });
  img.setAttribute("src", url.toString());
  img.setAttribute("expiresAt", expiresAt.toISOString());
  img.setAttribute("data-s3-key", node.attrs.s3Key);
  img.setAttribute("class", stdClasses);
};

const S3ImageRenderer: NodeViewRenderer = ({ node }): NodeView => {
  const dom = document.createElement("img");
  assignUrlToDom(node, dom);

  const selectedClass = "border-[--context-color]";

  return {
    dom,
    update: (updatedNode) => {
      if (updatedNode.type.name !== "s3image") return false;
      assignUrlToDom(updatedNode, dom);
      return true;
    },
    selectNode: () => {
      dom.classList.add(selectedClass);
    },
    deselectNode: () => {
      dom.classList.remove(selectedClass);
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
    fileKey: {
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
