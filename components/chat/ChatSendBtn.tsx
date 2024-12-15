import { ArrowUp, Loader2 } from "lucide-react";
import { FC } from "react";
import { Button } from "../ui/button";

interface ChatSendBtnProps {
  isSending: boolean;
  handleSend: () => void;
}

const ChatSendBtn: FC<ChatSendBtnProps> = ({ isSending, handleSend }) => {
  return (
    <Button
      className="rounded-full w-10 h-10 absolute bottom-1 right-1"
      onClick={handleSend}
      disabled={isSending}
    >
      {!isSending ? <ArrowUp /> : <Loader2 className="animate-spin" />}
    </Button>
  );
};

export default ChatSendBtn;
