import { JSONContent } from "@tiptap/core";
import { Dispatch, FC, SetStateAction } from "react";
import InboxEditor from "../ui-elements/editors/inbox-editor/InboxEditor";

interface ChatInputProps {
  setPrompt: Dispatch<SetStateAction<JSONContent>>;
  handleSend: () => void;
}

const ChatInput: FC<ChatInputProps> = ({ setPrompt, handleSend }) => (
  <InboxEditor
    notes={prompt}
    saveNotes={(editor) => setPrompt(editor.getJSON())}
    autoFocus
    placeholder="Send a message"
    saveAtCmdEnter={handleSend}
    showSaveStatus={false}
    className="pb-12 max-h-60 md:max-h-80 overflow-y-auto"
  />
);

export default ChatInput;
