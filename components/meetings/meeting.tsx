import useMeeting from "@/api/useMeeting";
import { Meeting } from "@/api/useMeetings";
import useMeetingTodos from "@/api/useMeetingTodos";
import { Context } from "@/contexts/ContextContext";
import { debouncedUpdateMeeting } from "@/helpers/meetings";
import { format } from "date-fns";
import {
  CheckCircle2,
  Circle,
  Info,
  Loader2,
  Mic,
  Sparkles,
  Square,
} from "lucide-react";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useRecording } from "@/contexts/RecordingContext";
import useCurrentUser from "@/api/useUser";
import useMeetingSonicData from "@/api/useMeetingSonicData";
import { buildSonicContextPrompt } from "@/helpers/sonic/context-prompt";
import { cn } from "@/lib/utils";
import AudioPulse from "./audio-pulse";
import MeetingMicSettings from "./meeting-mic-settings";
import MeetingDetectionPills from "./meeting-detection-pills";
import MeetingSummaryConfirmDialog from "./meeting-summary-confirm-dialog";
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
    markSummaryPending,
  } = useMeeting(meeting?.id);
  const [savingStatus, setSavingStatus] = useState(false);
  const [summaryDialogOpen, setSummaryDialogOpen] = useState(false);
  const [meetingDate, setMeetingDate] = useState(
    meeting?.meetingOn || new Date()
  );
  const { meetingTodos, mutate } = useMeetingTodos(meeting?.id);
  const { user } = useCurrentUser();
  const { getOpenProjects, ensureOpenProjectSummaries, resolveParticipant } =
    useMeetingSonicData();
  const sonic = useRecording();
  const sonicContextPrompt = buildSonicContextPrompt(
    user?.prompts,
    meeting?.context
  );

  // This meeting is the one the (single) engine is attached to.
  const isActiveMeeting = !!meeting?.id && sonic.activeMeetingId === meeting.id;
  // Terminal state: the summary has been produced AND transferred into the
  // topic notes (see summarize-meeting Lambda). Once summarized, the meeting is
  // "done" — retire the summary control, the detection pills, and fold the
  // transcript into the accordion.
  const isSummarized = meeting?.sonicSummaryStatus === "APPLIED";
  // A summary has already been requested or produced for this meeting
  // (PENDING/DONE/APPLIED — NOT ERROR, which should still allow a retry).
  // Once that's happened, there's no reason to offer a fresh recording.
  const summaryStarted =
    meeting?.sonicSummaryStatus === "PENDING" ||
    meeting?.sonicSummaryStatus === "DONE" ||
    isSummarized;
  // Recording that belongs to THIS meeting (not some other meeting's session).
  const isRecordingThis = isActiveMeeting && sonic.recording;
  // The engine is busy with a different meeting → block starting a second one.
  const busyElsewhere = (sonic.recording || sonic.starting) && !isActiveMeeting;

  // Stop offering the recording control more than 4h after the meeting
  // started — by then the meeting is over and a fresh recording makes no
  // sense. A recording already in progress for this meeting is never hidden.
  // We keep a ticking `now` in state (updated by a timer, not read via an
  // impure Date.now() in render) and DERIVE the flag from it + meetingOnMs, so
  // it's correct as soon as the meeting data loads (not only after the first
  // timer tick) and still elapses while the page stays open.
  const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;
  const meetingOnMs = meeting?.meetingOn?.getTime();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(timer);
  }, []);
  const recordingWindowPassed =
    meetingOnMs !== undefined && now - meetingOnMs > FOUR_HOURS_MS;

  // Offer the summary action only once recording has stopped AND there's a
  // transcript to summarize.
  const canSummarize =
    !isRecordingThis &&
    !(isActiveMeeting && sonic.starting) &&
    (meeting?.sonicTranscript?.length ?? 0) > 0;

  // Only reveal the transcript panel once recording has started (or is
  // starting) for this meeting, or once there's already transcript content /
  // a summary run to show. Before the first recording, the panel stays hidden.
  const showTranscriptPanel =
    isRecordingThis ||
    (isActiveMeeting && sonic.starting) ||
    (meeting?.sonicTranscript?.length ?? 0) > 0 ||
    meeting?.sonicSummaryStatus === "PENDING" ||
    meeting?.sonicSummaryStatus === "ERROR";

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
      detections: meeting.sonicDetections,
    });
  }, [meeting, sonicOptions, bindMeeting]);

  useEffect(() => {
    bindThisMeeting();
  }, [bindThisMeeting]);

  const handleStart = useCallback(() => {
    if (!meeting?.id) return;
    // Ensure the engine is bound to THIS meeting before starting.
    bindThisMeeting();
    // Pre-warm the full project summaries the Sonic context needs (the active
    // set is lean and doesn't carry the heavy summary markdown), then start.
    void ensureOpenProjectSummaries().finally(() => void sonic.start());
  }, [meeting, bindThisMeeting, ensureOpenProjectSummaries, sonic]);
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

  /**
   * A detection was resolved via the search/create dialog. The person is
   * assigned + confirmed as a MENTIONED person (sonic.assignCreatedPerson),
   * never as a meeting participant — the user explicitly distinguishes who
   * actually attended (added via the participant selector) from who was
   * merely talked about. Still notify a live Sonic session so it has the
   * person's context going forward.
   */
  const handleAssignCreatedPerson = (
    detectedId: string,
    person: {
      personId: string;
      name: string;
      company: string | null;
      role: string | null;
    }
  ) => {
    if (isRecordingThis) sonic.notifyParticipantAdded(person.personId);
    sonic.assignCreatedPerson(detectedId, person);
  };

  /**
   * Toggle acceptance of a suggested project. Confirming also adds the project
   * to the meeting (and notifies a live Sonic session); un-confirming only
   * flips the flag (the activity, once created, stays).
   */
  const handleToggleConfirmProject = (projectId: string) => {
    const wasConfirmed = sonic.suggestedProjects.find(
      (p) => p.projectId === projectId
    )?.confirmed;
    if (!wasConfirmed) {
      createMeetingActivity(projectId);
      if (isRecordingThis) sonic.notifyProjectAdded(projectId);
    }
    sonic.toggleConfirmProject(projectId);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {meeting?.id &&
          !summaryStarted &&
          (isRecordingThis || !recordingWindowPassed) &&
          (!isRecordingThis ? (
            <div className="flex items-center gap-1">
              <Button
                onClick={handleStart}
                size="sm"
                className="gap-1"
                disabled={sonic.starting || busyElsewhere}
                title={
                  busyElsewhere
                    ? "A recording is already running for another meeting."
                    : undefined
                }
              >
                {sonic.starting && isActiveMeeting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
                {sonic.starting && isActiveMeeting
                  ? "Starting…"
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
              Stop
              <span className="text-white ml-1">
                <AudioPulse level={sonic.audioLevel} />
              </span>
            </Button>
          ))}
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
        {meeting?.id &&
          !isSummarized &&
          (canSummarize || meeting.sonicSummaryStatus === "PENDING") && (
            <Button
              onClick={() => setSummaryDialogOpen(true)}
              variant="outline"
              size="sm"
              className="gap-1"
              disabled={
                meeting.activities.length === 0 ||
                meeting.sonicSummaryStatus === "PENDING"
              }
              title={
                meeting.activities.length === 0
                  ? "Add at least one topic (project) to the meeting first."
                  : undefined
              }
            >
              {meeting.sonicSummaryStatus === "PENDING" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {meeting.sonicSummaryStatus === "PENDING"
                ? "Creating summary…"
                : "Create summary"}
            </Button>
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

      {/* Detection pills (people + projects): visible both while recording
          and after stop, until the summary is actually requested — the user
          can keep assigning/confirming detections right up to that point. */}
      {isActiveMeeting &&
        !isSummarized &&
        (sonic.detectedPeople.length > 0 ||
          sonic.suggestedProjects.length > 0) && (
          <div className="transition-opacity duration-500 opacity-100 animate-in fade-in">
            <MeetingDetectionPills
              people={sonic.detectedPeople}
              suggestedProjects={sonic.suggestedProjects}
              onSelectMatch={sonic.selectMatch}
              onToggleConfirm={sonic.toggleConfirm}
              onRejectPerson={sonic.rejectDetectedPerson}
              onAssignCreatedPerson={handleAssignCreatedPerson}
              onToggleConfirmProject={handleToggleConfirmProject}
              onDismissProject={sonic.dismissSuggestedProject}
            />
          </div>
        )}

      {/* Summary confirmation dialog: opened by the "Zusammenfassung
          erstellen" button above, not automatically after stop(). */}
      {meeting?.id && (
        <MeetingSummaryConfirmDialog
          open={summaryDialogOpen}
          onOpenChange={setSummaryDialogOpen}
          people={sonic.detectedPeople}
          suggestedProjects={sonic.suggestedProjects}
          onSelectMatch={sonic.selectMatch}
          onToggleConfirm={sonic.toggleConfirm}
          onRejectPerson={sonic.rejectDetectedPerson}
          onAssignCreatedPerson={handleAssignCreatedPerson}
          onToggleConfirmProject={handleToggleConfirmProject}
          onDismissProject={sonic.dismissSuggestedProject}
          onConfirm={() => {
            markSummaryPending();
            sonic.requestSummary(meeting.id);
          }}
        />
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

            {/* Once summarized, the transcript is reference-only — collapse it
                into the accordion alongside the other sections. */}
            {isSummarized && (
              <MeetingLiveTranscription
                recording={false}
                transcript={meeting.sonicTranscript ?? []}
                estimatedCostUsd={0}
                elapsedSeconds={0}
                systemAudioNote={null}
                asAccordionItem
              />
            )}
          </>
        )}
      </Accordion>

      {meeting && !isSummarized && showTranscriptPanel && (
        <MeetingLiveTranscription
          recording={isRecordingThis}
          transcript={
            isActiveMeeting ? sonic.transcript : (meeting.sonicTranscript ?? [])
          }
          estimatedCostUsd={isActiveMeeting ? sonic.estimatedCostUsd : 0}
          elapsedSeconds={isActiveMeeting ? sonic.elapsedSeconds : 0}
          systemAudioNote={isActiveMeeting ? sonic.systemAudioNote : null}
          summarizing={meeting.sonicSummaryStatus === "PENDING"}
          summaryError={
            meeting.sonicSummaryStatus === "ERROR"
              ? meeting.sonicSummaryError
              : null
          }
        />
      )}
    </div>
  );
};

export default MeetingRecord;
