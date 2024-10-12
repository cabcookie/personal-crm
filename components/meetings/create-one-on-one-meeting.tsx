import { useContextContext } from "@/contexts/ContextContext";
import { FC } from "react";
import PeopleSelector from "../ui-elements/selectors/people-selector";
import { Label } from "../ui/label";
import { CreateMeetingProps } from "./useMeetingFilter";

type CreateOneOnOneMeetingProps = {
  createMeeting: (props: CreateMeetingProps) => void;
};

const CreateOneOnOneMeeting: FC<CreateOneOnOneMeetingProps> = ({
  createMeeting,
}) => {
  const { context } = useContextContext();

  return (
    <div>
      <Label className="font-semibold">Create 1:1 Meeting:</Label>
      <PeopleSelector
        placeholder="Select person for 1:1…"
        value=""
        onChange={(personId) =>
          createMeeting({
            topic: "",
            participantId: personId ?? undefined,
            context,
          })
        }
      />
    </div>
  );
};

export default CreateOneOnOneMeeting;
