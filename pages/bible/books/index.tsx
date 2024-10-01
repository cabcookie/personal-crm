import useBible from "@/api/useBible";
import BibleBookAccordionItem from "@/components/bible/book";
import ApiLoadingError from "@/components/layouts/ApiLoadingError";
import MainLayout from "@/components/layouts/MainLayout";
import LoadingAccordionItem from "@/components/ui-elements/accordion/LoadingAccordionItem";
import { Accordion } from "@/components/ui/accordion";
import { flow, identity, map, times } from "lodash/fp";

const BibleBooksPage = () => {
  const { bible, isLoading, error } = useBible();
  return (
    <MainLayout title="Bible" sectionName="Bible">
      <div className="space-y-6">
        <div className="space-y-4">
          <ApiLoadingError title="Loading bible books failed" error={error} />

          {!isLoading && bible?.length === 0 && (
            <div className="text-muted-foreground text-sm font-semibold">
              No books
            </div>
          )}

          <Accordion type="single" collapsible>
            {isLoading &&
              flow(
                times(identity),
                map((id: number) => (
                  <LoadingAccordionItem
                    key={id}
                    value={`loading-${id}`}
                    sizeTitle="sm"
                    sizeSubtitle="lg"
                  />
                ))
              )(10)}

            {bible?.map((book) => (
              <BibleBookAccordionItem key={book.id} book={book} />
            ))}
          </Accordion>
        </div>
      </div>
    </MainLayout>
  );
};

export default BibleBooksPage;
