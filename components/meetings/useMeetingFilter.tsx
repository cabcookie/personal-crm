import useMeetings, { Meeting } from "@/api/useMeetings";
import { useContextContext } from "@/contexts/ContextContext";
import { filter, flow, map, uniq } from "lodash/fp";
import {
  ComponentType,
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from "react";
import useMeetingPagination from "./useMeetingPagination";

interface MeetingFilterType {
  meetings: ReturnType<typeof useMeetings>["meetings"] | undefined;
  meetingDates: string[];
  createMeeting: ReturnType<typeof useMeetings>["createMeeting"];
  selectedFilter: TMeetingFilters;
  availableFilters: TMeetingFilters[];
  onSelectFilter: (selectedFilter: string) => void;
  fromDate: ReturnType<typeof useMeetingPagination>["fromDate"];
  toDate: ReturnType<typeof useMeetingPagination>["toDate"];
  handleNextClick: ReturnType<typeof useMeetingPagination>["handleNextClick"];
  handlePrevClick: ReturnType<typeof useMeetingPagination>["handlePrevClick"];
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

const MEETING_FILTERS = ["All", "With Todos", "Old versions"] as const;

export type TMeetingFilters = (typeof MEETING_FILTERS)[number];

const isValidMeetingFilter = (filter: string): filter is TMeetingFilters =>
  MEETING_FILTERS.includes(filter as TMeetingFilters);

const hasTodos = (meeting: Meeting) => meeting.hasOpenTodos;

const hasOldVersion = (meeting: Meeting) =>
  meeting.hasOldVersionFormattedActivities;

const MeetingFilterProvider: FC<MeetingFilterProviderProps> = ({
  children,
}) => {
  const { context } = useContextContext();
  const { fromDate, toDate, handleNextClick, handlePrevClick } =
    useMeetingPagination();

  const { meetings, createMeeting } = useMeetings({
    context,
    startDate: fromDate,
  });
  const [meetingDates, setMeetingDates] = useState<string[]>([]);

  const [meetingFilter, setMeetingFilter] = useState<TMeetingFilters>("All");
  const [filtered, setFiltered] = useState<Meeting[] | undefined>(undefined);

  useEffect(() => {
    if (!meetings) return setFiltered(undefined);
    if (meetingFilter === "All") return setFiltered(meetings);
    if (meetingFilter === "With Todos")
      return flow(filter(hasTodos), setFiltered)(meetings);
    if (meetingFilter === "Old versions")
      return flow(filter(hasOldVersion), setFiltered)(meetings);
  }, [meetingFilter, meetings]);

  useEffect(() => {
    flow(map("meetingDayStr"), uniq, setMeetingDates)(filtered);
  }, [filtered]);

  const onFilterChange = (newFilter: string) => {
    if (!isValidMeetingFilter(newFilter)) return;
    setMeetingFilter(newFilter);
  };

  return (
    <MeetingFilter.Provider
      value={{
        meetings: filtered,
        meetingDates,
        createMeeting,
        selectedFilter: meetingFilter,
        availableFilters: [...MEETING_FILTERS],
        onSelectFilter: onFilterChange,
        fromDate,
        toDate,
        handleNextClick,
        handlePrevClick,
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
      <MeetingFilterProvider>
        <Component {...componentProps} />
      </MeetingFilterProvider>
    );
  };
}