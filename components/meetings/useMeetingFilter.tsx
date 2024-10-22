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
import { filter, flow, map, uniq } from "lodash/fp";
import {
  ComponentType,
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from "react";
import { SearchProvider, useSearch } from "../search/useSearch";
import useMeetingPagination from "./useMeetingPagination";

interface MeetingFilterType {
  meetings: ReturnType<typeof useMeetings>["meetings"] | undefined;
  meetingDates: string[];
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
  const { meetings, createMeeting, createMeetingParticipant } = useMeetings({
    context,
    startDate: fromDate,
  });
  const [meetingDates, setMeetingDates] = useState<string[]>([]);
  const [meetingFilter, setMeetingFilter] = useState<TMeetingFilters>("All");
  const [filtered, setFiltered] = useState<Meeting[] | undefined>(undefined);
  const { people } = usePeople();
  const { searchText, isSearchActive } = useSearch();

  useEffect(() => {
    if (!meetings) return setFiltered(undefined);
    if (searchText)
      return flow(
        filter(topicIncludesSearchText(searchText)),
        setFiltered
      )(meetings);
    if (meetingFilter === "All") return setFiltered(meetings);
    if (meetingFilter === "With Todos")
      return flow(filter(hasTodos), setFiltered)(meetings);
    if (meetingFilter === "Old versions")
      return flow(filter(hasOldVersion), setFiltered)(meetings);
  }, [meetingFilter, meetings, searchText]);

  useEffect(() => {
    flow(map("meetingDayStr"), uniq, setMeetingDates)(filtered);
  }, [filtered]);

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
