import { toISODateTimeString } from "@/helpers/functional";
import { cn } from "@/lib/utils";
import { Editor, mergeAttributes } from "@tiptap/core";
import { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { NodeView } from "@tiptap/pm/view";
import { Node, NodeViewRenderer } from "@tiptap/react";
import { getUrl } from "aws-amplify/storage";
import { isFuture } from "date-fns";
import { consumeFreshlyPastedBlockId } from "./image-handling";

const assignUrlToDom = async (node: ProseMirrorNode, img: HTMLImageElement) => {
  const stdClasses = "rounded-md border-2 border-solid";
  if (!node.attrs.s3Key) {
    img.setAttribute("src", node.attrs.src);
    img.setAttribute("class", cn("animate-pulseOpacity", stdClasses));
    return;
  }
  if (node.attrs.expiresAt && isFuture(new Date(node.attrs.expiresAt))) {
    img.setAttribute("src", node.attrs.src);
    img.setAttribute("data-expires-at", node.attrs.expiresAt);
    img.setAttribute("data-s3-key", node.attrs.s3Key);
    img.setAttribute("class", stdClasses);
    return;
  }
  const { url, expiresAt } = await getUrl({ path: node.attrs.s3Key });
  img.setAttribute("src", url.toString());
  img.setAttribute("data-expires-at", toISODateTimeString(expiresAt));
  img.setAttribute("data-s3-key", node.attrs.s3Key);
  img.setAttribute("class", stdClasses);
};

const scheduleScrollOnLoad = (
  node: ProseMirrorNode,
  img: HTMLImageElement,
  editor: Editor
) => {
  if (!consumeFreshlyPastedBlockId(node.attrs.blockId)) return;
  const triggerScroll = () => editor.commands.scrollIntoView();
  if (img.complete && img.naturalHeight > 0) {
    triggerScroll();
    return;
  }
  img.addEventListener("load", triggerScroll, { once: true });
  img.addEventListener("error", triggerScroll, { once: true });
};

const S3ImageRenderer: NodeViewRenderer = ({ node, editor }): NodeView => {
  const dom = document.createElement("img");
  assignUrlToDom(node, dom);
  scheduleScrollOnLoad(node, dom, editor as Editor);

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
    blockId: {
      default: null,
      parseHTML: (element) => {
        return element.getAttribute("data-block-id");
      },
      renderHTML: (attributes) => ({
        "data-block-id": attributes.blockId,
      }),
    },
    src: {
      default: null,
      parseHTML: (element) => {
        return element.getAttribute("src");
      },
      renderHTML: (attributes) => ({
        src: attributes.src,
      }),
    },
    fileKey: {
      default: null,
      parseHTML: (element) => {
        return element.getAttribute("data-file-key");
      },
      renderHTML: (attributes) => ({
        "data-file-key": attributes.fileKey,
      }),
    },
    s3Key: {
      default: null,
      parseHTML: (element) => {
        return element.getAttribute("data-s3-key");
      },
      renderHTML: (attributes) => ({
        "data-s3-key": attributes.s3Key,
      }),
    },
    expiresAt: {
      default: null,
      parseHTML: (element) => {
        return element.getAttribute("data-expires-at");
      },
      renderHTML: (attributes) => ({
        "data-expires-at": attributes.expiresAt,
      }),
    },
  }),
  parseHTML() {
    return [
      {
        tag: `img[data-type="${this.name}"]`,
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(HTMLAttributes, { "data-type": this.name })];
  },
  addNodeView: () => S3ImageRenderer,
  addStorage() {
    return {
      markdown: {
        serialize(state: { write: (arg0: string) => void }) {
          state.write("[IMAGE]\n\n");
        },
      },
    };
  },
});

export default S3ImageExtension;
