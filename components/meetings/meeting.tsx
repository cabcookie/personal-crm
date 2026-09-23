import useMeeting from "@/api/useMeeting";
import { Meeting } from "@/api/useMeetings";
import useMeetingTodos from "@/api/useMeetingTodos";
import { Context } from "@/contexts/ContextContext";
import { debouncedUpdateMeeting } from "@/helpers/meetings";
import { format } from "date-fns";
import { CheckCircle2, Circle, Info, Loader2, Mic, Square } from "lucide-react";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useRecording } from "@/contexts/RecordingContext";
import useCurrentUser from "@/api/useUser";
import useMeetingSonicData from "@/api/useMeetingSonicData";
import { buildSonicContextPrompt } from "@/helpers/sonic/context-prompt";
import { cn } from "@/lib/utils";
import AudioPulse from "./audio-pulse";
import MeetingMicSettings from "./meeting-mic-settings";
import DetectedPeopleMarker from "./detected-people-marker";
import MeetingSuggestedProjectsBar from "./meeting-suggested-projects-bar";
import MeetingPromptDialog from "./meeting-prompt-dialog";
import { contexts } from "../navigation-menu/ContextSwitcher";
import DefaultAccordionItem from "../ui-elements/accordion/DefaultAccordionItem";
import LoadingAccordionItem from "../ui-elements/accordion/LoadingAccordionItem";
import ButtonGroup from "../ui-elements/btn-group/btn-group";
import ContextWarning from "../ui-elements/context-warning/context-warning";
import DateSelector from "../ui-elements/selectors/date-selector";
import PeopleSelector from "../ui-elements/selectors/people-selector";
import ProjectSelector from "../ui-elements/selectors/project-selector";
import { Accordion } from "../ui/accordion";
import { Button } from "../ui/button";
import { MeetingExportButton } from "../exports/MeetingExportButton";
import MeetingActivityList from "./meeting-activity-list";
import MeetingLiveTranscription from "./meeting-live-transcription";
import MeetingNextActions from "./meeting-next-actions";
import MeetingParticipants from "./meeting-participants";
import MeetingProjectRecommender from "./meeting-project-recommender";

type MeetingRecordProps = {
  meeting?: Meeting;
  addParticipants?: boolean;
  showContext?: boolean;
  showMeetingDate?: boolean;
  addProjects?: boolean;
};

const MeetingRecord: FC<MeetingRecordProps> = ({
  meeting,
  addParticipants,
  showContext,
  showMeetingDate,
  addProjects,
}) => {
  const [meetingContext, setMeetingContext] = useState(meeting?.context);
  const [immediateTasksDone, setImmediateTasksDone] = useState(
    !!meeting?.immediateTasksDone
  );
  const {
    createMeetingActivity,
    removeMeetingParticipant,
    updateMeetingContext,
    updateMeeting,
    createMeetingParticipant,
    updateImmediateTasksDoneStatus,
  } = useMeeting(meeting?.id);
  const [savingStatus, setSavingStatus] = useState(false);
  const [meetingDate, setMeetingDate] = useState(
    meeting?.meetingOn || new Date()
  );
  const { meetingTodos, mutate } = useMeetingTodos(meeting?.id);
  const { user } = useCurrentUser();
  const { getOpenProjects, resolveParticipant } = useMeetingSonicData();
  const sonic = useRecording();
  const sonicContextPrompt = buildSonicContextPrompt(
    user?.prompts,
    meeting?.context
  );

  // This meeting is the one the (single) engine is attached to.
  const isActiveMeeting = !!meeting?.id && sonic.activeMeetingId === meeting.id;
  // Recording that belongs to THIS meeting (not some other meeting's session).
  const isRecordingThis = isActiveMeeting && sonic.recording;
  // The engine is busy with a different meeting → block starting a second one.
  const busyElsewhere = (sonic.recording || sonic.starting) && !isActiveMeeting;

  const sonicOptions = useMemo(
    () => ({
      contextPrompt: sonicContextPrompt,
      meetingTopic: meeting?.topic,
      getOpenProjects,
      resolveParticipant,
      participantIds: meeting?.participantIds,
    }),
    [
      sonicContextPrompt,
      meeting?.topic,
      getOpenProjects,
      resolveParticipant,
      meeting?.participantIds,
    ]
  );

  // Attach this meeting to the global engine (refreshes live options; when idle
  // it rehydrates the persisted transcript + summary so returning shows them).
  const { bindMeeting } = sonic;
  const bindThisMeeting = useCallback(() => {
    if (!meeting?.id) return;
    bindMeeting(meeting.id, sonicOptions, {
      transcript: meeting.sonicTranscript,
      summary: meeting.sonicSummary,
    });
  }, [meeting, sonicOptions, bindMeeting]);

  useEffect(() => {
    bindThisMeeting();
  }, [bindThisMeeting]);

  const handleStart = useCallback(() => {
    if (!meeting?.id) return;
    // Ensure the engine is bound to THIS meeting before starting.
    bindThisMeeting();
    void sonic.start();
  }, [meeting, bindThisMeeting, sonic]);
  const [lastMeeting, setLastMeeting] = useState(meeting);
  const [lastTasksDone, setLastTasksDone] = useState(
    meeting?.immediateTasksDone
  );

  // Both values stay in state because handlers update them optimistically;
  // adjusting during render is React's documented alternative to syncing
  // them in an effect.
  if (lastMeeting !== meeting) {
    setLastMeeting(meeting);
    if (meeting) {
      setMeetingDate(meeting.meetingOn);
      setMeetingContext(meeting.context);
    }
  }

  if (lastTasksDone !== meeting?.immediateTasksDone) {
    setLastTasksDone(meeting?.immediateTasksDone);
    setImmediateTasksDone(!!meeting?.immediateTasksDone);
  }

  const addParticipant = (personId: string | null) => {
    if (!personId) return;
    createMeetingParticipant(personId);
    // Tell the live Sonic session about the new participant (no-op if idle).
    if (isRecordingThis) sonic.notifyParticipantAdded(personId);
  };

  const updateContext = (context: Context) => {
    if (!meeting) return;
    setMeetingContext(context);
    updateMeetingContext(context);
  };

  const handleDateChange = (date: Date) => {
    if (!meeting) return;
    debouncedUpdateMeeting(
      meeting,
      updateMeeting
    )({
      meetingOn: date,
    });
  };

  const handleUpdateImmediateTasksDone = async () => {
    const newStatus = !meeting?.immediateTasksDone;
    setSavingStatus(true);
    const result = await updateImmediateTasksDoneStatus(newStatus);
    if (result) {
      setImmediateTasksDone(newStatus);
      setSavingStatus(false);
    }
  };

  const handleSelectProject = (projectId: string | null) => {
    if (!projectId) return;
    createMeetingActivity(projectId);
    if (isRecordingThis) sonic.notifyProjectAdded(projectId);
  };

  /** Accept a Sonic project suggestion: add it to the meeting, notify Sonic,
   * and clear the suggestion. */
  const acceptSuggestedProject = (projectId: string) => {
    createMeetingActivity(projectId);
    if (isRecordingThis) sonic.notifyProjectAdded(projectId);
    sonic.dismissSuggestedProject(projectId);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {meeting?.id &&
          (!isRecordingThis ? (
            <div className="flex items-center gap-1">
              <Button
                onClick={handleStart}
                size="sm"
                className="gap-1"
                disabled={sonic.starting || busyElsewhere}
                title={
                  busyElsewhere
                    ? "Es läuft bereits eine Aufnahme für ein anderes Meeting."
                    : undefined
                }
              >
                {sonic.starting && isActiveMeeting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
                {sonic.starting && isActiveMeeting
                  ? "Startet…"
                  : "Record for AI Summary"}
              </Button>
              <MeetingMicSettings
                mics={sonic.mics}
                selectedMicId={sonic.selectedMicId}
                onSelect={sonic.setSelectedMicId}
                loadMics={sonic.loadMics}
                disabled={sonic.starting}
              />
            </div>
          ) : (
            <Button
              onClick={sonic.stop}
              size="sm"
              variant="destructive"
              className="gap-1"
            >
              <Square className="w-4 h-4" />
              Stoppen
              <span className="text-white ml-1">
                <AudioPulse level={sonic.audioLevel} />
              </span>
            </Button>
          ))}
        {/* Discreet detected-people marker while THIS meeting records. */}
        {isRecordingThis && (
          <DetectedPeopleMarker
            people={sonic.detectedPeople}
            unconfirmedCount={sonic.unconfirmedCount}
            recentDetectionName={sonic.recentDetectionName}
            onToggleConfirm={sonic.toggleConfirm}
            onSelectMatch={sonic.selectMatch}
          />
        )}
        <Button
          onClick={handleUpdateImmediateTasksDone}
          variant="outline"
          size="sm"
          className="gap-1"
          disabled={savingStatus}
        >
          {savingStatus ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving…
            </>
          ) : immediateTasksDone ? (
            <>
              <Circle className="w-4 h-4" />
              Set meeting open
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Confirm meeting done
            </>
          )}
        </Button>
        {meeting?.id && (
          <MeetingExportButton
            meetingId={meeting.id}
            meetingTopic={meeting.topic}
            meetingOn={meeting.meetingOn}
          />
        )}
        {meeting?.id && <MeetingPromptDialog context={meeting.context} />}
      </div>

      {/* Before recording: the browser-prompt hint (fades out on start). */}
      {meeting?.id && (
        <div
          className={cn(
            "transition-opacity duration-500",
            isRecordingThis
              ? "opacity-0 pointer-events-none h-0 overflow-hidden"
              : "opacity-100"
          )}
        >
          <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-md p-2 mx-2 md:mx-4">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Beim Start der Transkription fragt der Browser nach einer
              Bildschirm-/Tab-Freigabe — das ist nötig, um das Meeting-Audio
              mitzuhören. Aktiviere im Dialog „Audio teilen“. Das Bild wird
              nicht verwendet (der Video-Anteil wird sofort verworfen);
              übertragen wird ausschließlich Audio.
            </span>
          </div>
        </div>
      )}

      {/* While recording: the suggested-projects bar (fades in). Detected
          people now live in the discreet marker next to the controls. */}
      {isRecordingThis && sonic.suggestedProjects.length > 0 && (
        <div className="transition-opacity duration-500 opacity-100 animate-in fade-in space-y-2">
          <MeetingSuggestedProjectsBar
            suggestions={sonic.suggestedProjects}
            projects={getOpenProjects()}
            onAccept={acceptSuggestedProject}
            onDismiss={sonic.dismissSuggestedProject}
          />
        </div>
      )}

      {showContext && (
        <div className="space-y-2">
          <h3 className="mx-2 md:mx-4 font-semibold tracking-tight">Context</h3>
          <ButtonGroup
            values={contexts}
            selectedValue={!meeting ? "" : meetingContext || "family"}
            onSelect={(val: string) => {
              if (!contexts.includes(val as Context)) return;
              updateContext(val as Context);
            }}
            disabled={!meeting}
          />
          {meeting && (
            <ContextWarning
              recordContext={meetingContext}
              className="mx-2 md:mx-4"
            />
          )}
        </div>
      )}

      {addParticipants && (
        <PeopleSelector
          placeholder="Add participant…"
          value=""
          onChange={addParticipant}
          allowNewPerson
          disabled={!meeting}
        />
      )}

      {addProjects && (
        <ProjectSelector
          value=""
          onChange={handleSelectProject}
          allowCreateProjects
          placeholder="Add a project…"
          disabled={!meeting}
        />
      )}

      {addProjects && (
        <MeetingProjectRecommender
          meeting={meeting}
          addProjectToMeeting={handleSelectProject}
        />
      )}

      <Accordion type="single" collapsible>
        {showMeetingDate &&
          (!meeting ? (
            <LoadingAccordionItem
              value="loading-date"
              sizeTitle="base"
              sizeSubtitle="xs"
            />
          ) : (
            <DefaultAccordionItem
              value="meeting-date"
              triggerTitle="Meeting on"
              triggerSubTitle={meeting && format(meeting.meetingOn, "PPp")}
            >
              <DateSelector
                date={meetingDate}
                setDate={handleDateChange}
                selectHours
              />
            </DefaultAccordionItem>
          ))}

        {meeting && (
          <>
            <MeetingParticipants
              participantIds={meeting.participantIds}
              addParticipant={!addParticipants ? undefined : addParticipant}
              removeParticipant={removeMeetingParticipant}
            />

            <MeetingNextActions todos={meetingTodos} mutate={mutate} />

            <MeetingActivityList meeting={meeting} />
          </>
        )}
      </Accordion>

      {meeting && (
        <MeetingLiveTranscription
          recording={isRecordingThis}
          transcript={
            isActiveMeeting ? sonic.transcript : (meeting.sonicTranscript ?? [])
          }
          estimatedCostUsd={isActiveMeeting ? sonic.estimatedCostUsd : 0}
          elapsedSeconds={isActiveMeeting ? sonic.elapsedSeconds : 0}
          systemAudioNote={isActiveMeeting ? sonic.systemAudioNote : null}
          summary={isActiveMeeting ? sonic.summary : meeting.sonicSummary}
          summarizing={isActiveMeeting ? sonic.summarizing : false}
        />
      )}
    </div>
  );
};

export default MeetingRecord;
