import { useAccountsContext } from "@/api/ContextAccounts";
import usePeople from "@/api/usePeople";
import { Person } from "@/api/usePerson";
import {
  EditorJsonContent,
  isUpToDate,
  MyExtensions,
} from "@/helpers/ui-notes-writer";
import { handlePastingImage } from "@/helpers/ui-notes-writer/image-handling";
import {
  filterPersonByQuery,
  limitItems,
  mapPersonToSuggestion,
  renderer,
} from "@/helpers/ui-notes-writer/suggestions";
import { cn } from "@/lib/utils";
import { Editor } from "@tiptap/core";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import { filter, flow, map } from "lodash/fp";
import { FC, useEffect } from "react";
import S3ImageExtension from "./S3ImageExtension";

type NotesWriterProps = {
  people: Person[];
  notes: EditorJsonContent;
  saveNotes?: (editor: Editor) => void;
  autoFocus?: boolean;
  placeholder?: string;
  onSubmit?: (item: EditorJsonContent) => void;
  readonly?: boolean;
  showSaveStatus?: boolean;
};

const NotesWriterInner: FC<NotesWriterProps> = ({
  people,
  notes,
  saveNotes,
  autoFocus,
  // onSubmit,
  readonly,
  showSaveStatus = true,
  placeholder = "Start taking notes...",
}) => {
  const { getAccountNamesByIds } = useAccountsContext();

  const editor = useEditor({
    extensions: [
      ...MyExtensions,
      Mention.configure({
        HTMLAttributes: { class: "text-blue-400" },
        suggestion: {
          items: ({ query }) =>
            flow(
              filter(filterPersonByQuery(query)),
              map(mapPersonToSuggestion(getAccountNamesByIds)),
              limitItems(5)
            )(people),
          render: renderer,
        },
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
      saveNotes(editor);
    },
  });

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

const NotesWriter: FC<Omit<NotesWriterProps, "people">> = (props) => {
  const { people } = usePeople();

  return people && <NotesWriterInner {...props} people={people} />;
};

export default NotesWriter;
