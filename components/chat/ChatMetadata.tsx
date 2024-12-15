import { MentionedPerson } from "@/helpers/chat/set-mentioned-people";
import { PersonJob } from "@/pages/chat";
import { FC } from "react";

interface ChatMetadataProps {
  currentJob?: PersonJob;
  mentionedPeople?: MentionedPerson[];
}

const ChatMetadata: FC<ChatMetadataProps> = ({ currentJob, mentionedPeople }) =>
  currentJob?.user && (
    <div className="text-xs text-muted-foreground p-2 pt-1 space-y-1 bg-white/95">
      <div>We will integrate the following information in the request:</div>
      <ul className="list-disc list-inside">
        <li>
          Your name: {currentJob.user} (
          {currentJob.jobRole && `${currentJob.jobRole} `}at{" "}
          {currentJob.employer})
        </li>
        {mentionedPeople && mentionedPeople.length > 0 && (
          <li>
            Information about these people:{" "}
            {mentionedPeople.map((person) => person.name).join(", ")}
          </li>
        )}
      </ul>
    </div>
  );

export default ChatMetadata;
