import { useAccountsContext } from "@/api/ContextAccounts";
import usePeople from "@/api/usePeople";
import { Person, PersonAccount } from "@/api/usePerson";
import {
  EditorJsonContent,
  getTasksData,
  isUpToDate,
  MyExtensions,
  SerializerOutput,
} from "@/helpers/ui-notes-writer";
import { atMentionSuggestions } from "@/helpers/ui-notes-writer/suggestions";
import { cn } from "@/lib/utils";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorView } from "@tiptap/pm/view";
import { EditorContent, useEditor } from "@tiptap/react";
import { getUrl, uploadData } from "aws-amplify/storage";
import { flow, map } from "lodash/fp";
import { FC, useEffect } from "react";
import S3ImageExtension from "./S3ImageExtension";

type NotesWriterProps = {
  notes?: EditorJsonContent | string;
  saveNotes?: (serializer: () => SerializerOutput) => void;
  autoFocus?: boolean;
  placeholder?: string;
  onSubmit?: (item: EditorJsonContent) => void;
  readonly?: boolean;
  showSaveStatus?: boolean;
};

const NotesWriter: FC<NotesWriterProps> = ({
  notes,
  saveNotes,
  autoFocus,
  // onSubmit,
  readonly,
  showSaveStatus = true,
  placeholder = "Start taking notes...",
}) => {
  const { people } = usePeople();
  const { getAccountNamesByIds } = useAccountsContext();

  const editor = useEditor({
    extensions: [
      ...MyExtensions,
      Mention.configure({
        HTMLAttributes: { class: "text-blue-400" },
        suggestion: atMentionSuggestions({
          items: people?.map(({ id, name, accounts }: Person) => ({
            category: "person",
            id,
            label: name,
            information: flow(
              map((pa: PersonAccount) => pa.accountId),
              getAccountNamesByIds
            )(accounts),
          })),
        }),
      }),
      S3ImageExtension,
      Placeholder.configure({
        // emptyNodeClass:
        //   "text-muted-foreground relative before:content-['/_for_menu,_@_for_mentions'] before:absolute before:left-0",
        emptyEditorClass:
          "relative text-muted-foreground before:content-[attr(data-placeholder)] before:absolute before:left-0",
        placeholder,
      }),
    ],
    autofocus: autoFocus,
    editable: !readonly,
    editorProps: {
      // handleKeyDown: (view, event) => {
      //   if (!onSubmit) return false;
      //   if (event.metaKey && event.key === "Enter") {
      //     event.preventDefault();
      //     onSubmit(view.state.doc.toJSON());
      //     return true;
      //   }
      //   return false;
      // },
      handlePaste: (view, event) => {
        if (!event.clipboardData) return false;
        const { items } = event.clipboardData;

        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            handlePastingImage(items[i], view);
            return true;
          }
        }
        return false;
      },
    },
    content: notes,
    onUpdate: ({ editor }) => {
      if (!saveNotes) return;
      const jsonContent = editor.getJSON();
      saveNotes(() => ({ json: jsonContent, ...getTasksData(jsonContent) }));
    },
  });

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

  const handlePastingImage = async (
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

  useEffect(() => {
    if (!editor) return;
    if (editor.getText() === "" && notes) editor.commands.setContent(notes);
  }, [editor, notes]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!readonly);
  }, [editor, readonly]);

  useEffect(() => {
    if (!editor) return;
    editor.setOptions({
      editorProps: {
        attributes: {
          class: cn(
            "prose w-full max-w-full text-notesEditor rounded-md p-2 bg-inherit transition duration-1000 ease",
            showSaveStatus &&
              !readonly &&
              !isUpToDate(notes, editor.getJSON()) &&
              "bg-destructive/10"
          ),
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor?.getJSON(), notes]);

  useEffect(() => {
    if (editor?.isActive && autoFocus && !editor?.isFocused)
      editor.commands.focus();
  }, [editor?.commands, editor?.isActive, editor?.isFocused, autoFocus]);

  return (
    <>
      <EditorContent editor={editor} />
      <div id="at-mention-tippy" />
    </>
  );
};

export default NotesWriter;
