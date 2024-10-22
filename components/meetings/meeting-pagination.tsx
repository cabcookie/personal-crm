import { addDaysToDate, toLocaleDateString } from "@/helpers/functional";
import { cn } from "@/lib/utils";
import { isFuture, parseISO } from "date-fns";
import { flow } from "lodash/fp";
import { FC } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

const localizeDate = flow(parseISO, toLocaleDateString);

type MeetingPaginationProps = {
  fromDate: string;
  toDate: string;
  handlePrevClick: () => void;
  handleNextClick: () => void;
  className?: string;
};

const isToday = flow(parseISO, addDaysToDate(1), isFuture);

const MeetingPagination: FC<MeetingPaginationProps> = ({
  fromDate,
  toDate,
  handlePrevClick,
  handleNextClick,
  className,
}) => (
  <Pagination className={cn(className)}>
    <PaginationContent>
      <PaginationItem>
        <PaginationPrevious onClick={handlePrevClick} />
      </PaginationItem>
      <PaginationItem>
        {localizeDate(fromDate)} – {localizeDate(toDate)}
      </PaginationItem>
      <PaginationItem>
        <PaginationNext
          onClick={handleNextClick}
          className={cn(isToday(toDate) && "hidden")}
        />
      </PaginationItem>
    </PaginationContent>
  </Pagination>
);

export default MeetingPagination;
