import { useAccountsContext } from "@/api/ContextAccounts";
import usePeople from "@/api/usePeople";
import { PersonAccount } from "@/api/usePerson";
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
import { EditorContent, useEditor } from "@tiptap/react";
import { flow, map } from "lodash/fp";
import { FC, useEffect } from "react";

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
        suggestion: atMentionSuggestions({
          items: people?.map(({ id, name, accounts }) => ({
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
    // editorProps: {
    //   handleKeyDown: (view, event) => {
    //     if (!onSubmit) return false;
    //     if (event.metaKey && event.key === "Enter") {
    //       event.preventDefault();
    //       onSubmit(view.state.doc.toJSON());
    //       return true;
    //     }
    //     return false;
    //   },
    // },
    content: notes,
    onUpdate: ({ editor }) => {
      if (!saveNotes) return;
      const jsonContent = editor.getJSON();
      saveNotes(() => ({ json: jsonContent, ...getTasksData(jsonContent) }));
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

  return <EditorContent editor={editor} />;
};

export default NotesWriter;
