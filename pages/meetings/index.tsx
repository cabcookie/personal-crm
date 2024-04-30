import styles from "./Meetings.module.css";
import { useRouter } from "next/router";
import { useContextContext } from "@/contexts/ContextContext";
import useMeetings, { Meeting } from "@/api/useMeetings";
import MainLayout from "@/components/layouts/MainLayout";
import MeetingRecord from "@/components/meetings/meeting";
import SubmitButton from "@/components/ui-elements/submit-button";
import { useEffect, useState } from "react";
import Pagination from "@/components/ui-elements/pagination/pagination";
import { addDaysToDate, toLocaleDateString } from "@/helpers/functional";

const calculateDate = (page: number) =>
  addDaysToDate(page * -4 * 7 + 1)(new Date());

export default function MeetingsPage() {
  const { context } = useContextContext();
  const [page, setPage] = useState(1);
  const { meetings, loadingMeetings, meetingDates, createMeeting } =
    useMeetings({ context, page });
  const router = useRouter();
  const [fromDate, setFromDate] = useState(calculateDate(page));
  const [toDate, setToDate] = useState(calculateDate(page - 1));

  useEffect(() => {
    setFromDate(calculateDate(page));
    setToDate(calculateDate(page - 1));
  }, [page]);

  const ALLOW_FAKE_DATA_CREATION =
    process.env.NEXT_PUBLIC_ALLOW_FAKE_DATA_CREATION;

  const createAndOpenNewMeeting = async () => {
    const id = await createMeeting("New Meeting", context);
    if (!id) return;
    router.push(`/meetings/${id}`);
  };

  return (
    <MainLayout
      title="Meetings"
      sectionName="Meetings"
      addButton={{ label: "New", onClick: createAndOpenNewMeeting }}
    >
      <div className={styles.pagination}>
        <Pagination
          page={page}
          setPage={setPage}
          text={`${toLocaleDateString(fromDate)} - ${toLocaleDateString(
            toDate
          )}`}
        />
      </div>

      {ALLOW_FAKE_DATA_CREATION === "true" && (
        <SubmitButton onClick={() => console.log("clicked")}>
          Create Fake Data
        </SubmitButton>
      )}
      {loadingMeetings && "Loading..."}
      {meetingDates.map((date) => (
        <div key={date.toLocaleDateString()}>
          <h1 className={styles.date}>{date.toLocaleDateString()}</h1>
          {meetings
            ?.filter(
              ({ meetingOn }) =>
                meetingOn.toISOString().split("T")[0] ===
                date.toISOString().split("T")[0]
            )
            .map((meeting: Meeting) => (
              <MeetingRecord key={meeting.id} meeting={meeting} />
            ))}
        </div>
      ))}
    </MainLayout>
  );
}
