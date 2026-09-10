import useMeetings, { Meeting } from "@/api/useMeetings";
import usePeople from "@/api/usePeople";
import { useContextContext } from "@/contexts/ContextContext";
import {
  createMeetingName,
  CreateMeetingProps,
  hasOldVersion,
  hasTodos,
  isValidMeetingFilter,
  MEETING_FILTERS,
  TMeetingFilters,
  topicIncludesSearchText,
} from "@/helpers/meetings";
import { flow, map, uniq } from "lodash/fp";
import {
  ComponentType,
  createContext,
  FC,
  useContext,
  useMemo,
  useState,
} from "react";
import { SearchProvider, useSearch } from "../search/useSearch";
import useMeetingPagination from "./useMeetingPagination";

interface MeetingFilterType {
  meetings: ReturnType<typeof useMeetings>["meetings"] | undefined;
  meetingDates: string[];
  loadingMeetings: boolean;
  createMeeting: (props: CreateMeetingProps) => Promise<string | undefined>;
  selectedFilter: TMeetingFilters;
  availableFilters: TMeetingFilters[];
  onSelectFilter: (selectedFilter: string) => void;
  fromDate: ReturnType<typeof useMeetingPagination>["fromDate"];
  toDate: ReturnType<typeof useMeetingPagination>["toDate"];
  handleNextClick: ReturnType<typeof useMeetingPagination>["handleNextClick"];
  handlePrevClick: ReturnType<typeof useMeetingPagination>["handlePrevClick"];
  isSearchActive: boolean;
}

const MeetingFilter = createContext<MeetingFilterType | null>(null);

export const useMeetingFilter = () => {
  const filterContext = useContext(MeetingFilter);
  if (!filterContext)
    throw new Error(
      "useMeetingFilter must be used within MeetingFilterProvider"
    );
  return filterContext;
};

interface MeetingFilterProviderProps {
  children: React.ReactNode;
}

const MeetingFilterProvider: FC<MeetingFilterProviderProps> = ({
  children,
}) => {
  const { context } = useContextContext();
  const { fromDate, toDate, handleNextClick, handlePrevClick } =
    useMeetingPagination();
  const { meetings, createMeeting, createMeetingParticipant, loadingMeetings } =
    useMeetings({
      context,
      startDate: fromDate,
    });
  const [meetingFilter, setMeetingFilter] = useState<TMeetingFilters>("All");
  const { people } = usePeople();
  const { searchText, isSearchActive } = useSearch();

  // Derived from meetings and the active filter, so computed during render
  // rather than pushed into state from an effect. MEETING_FILTERS covers
  // exactly these three cases.
  const filtered: Meeting[] | undefined = useMemo(() => {
    if (!meetings) return undefined;
    // Native filter: the lodash/fp overloads mis-resolve here because
    // topicIncludesSearchText is typed as returning unknown.
    if (searchText) return meetings.filter(topicIncludesSearchText(searchText));
    if (meetingFilter === "With Todos") return meetings.filter(hasTodos);
    if (meetingFilter === "Old versions") return meetings.filter(hasOldVersion);
    return meetings;
  }, [meetingFilter, meetings, searchText]);

  const meetingDates: string[] = useMemo(
    () => flow(map("meetingDayStr"), uniq)(filtered),
    [filtered]
  );

  const onFilterChange = (newFilter: string) => {
    if (!isValidMeetingFilter(newFilter)) return;
    setMeetingFilter(newFilter);
  };

  const createMeetingAndParticipant = async ({
    topic,
    context,
    participantId,
  }: CreateMeetingProps) => {
    const meetingName = !participantId
      ? topic
      : createMeetingName({ participantId, people });
    if (!meetingName) return;
    const meetingId = await createMeeting(meetingName, context);
    if (!meetingId) return;
    if (!participantId) return meetingId;
    await createMeetingParticipant(meetingId, participantId);
    return meetingId;
  };

  return (
    <MeetingFilter.Provider
      value={{
        meetings: filtered,
        meetingDates,
        loadingMeetings,
        createMeeting: createMeetingAndParticipant,
        selectedFilter: meetingFilter,
        availableFilters: [...MEETING_FILTERS],
        onSelectFilter: onFilterChange,
        fromDate,
        toDate,
        handleNextClick,
        handlePrevClick,
        isSearchActive,
      }}
    >
      {children}
    </MeetingFilter.Provider>
  );
};

export function withMeetingFilter<Props extends object>(
  Component: ComponentType<Props>
) {
  return function WrappedProvider(componentProps: Props) {
    return (
      <SearchProvider>
        <MeetingFilterProvider>
          <Component {...componentProps} />
        </MeetingFilterProvider>
      </SearchProvider>
    );
  };
}
