import MainLayout from "@/components/layouts/MainLayout";
import ReviewHistory from "@/components/weekly-review/ReviewHistory";
import { useWeeklyReview } from "@/api/useWeeklyReview";
import { useRouter } from "next/router";

const WeeklyBusinessReviewPage = () => {
  const { createReview } = useWeeklyReview();
  const router = useRouter();

  const handleCreateNewReview = async () => {
    const newReview = await createReview(new Date());
    if (newReview) {
      router.push(`/weekly-business-review/${newReview.id}`);
    }
  };

  return (
    <MainLayout
      title="Weekly Business Review"
      sectionName="Weekly Business Review"
      addButton={{
        label: "New",
        onClick: handleCreateNewReview,
      }}
    >
      <div className="space-y-6">
        <div className="text-sm text-muted-foreground">
          Generate AI-powered business intelligence reports from your project
          activities. Reviews analyze the past 6 weeks of notes from open and
          recently closed projects.
        </div>

        <ReviewHistory />
      </div>
    </MainLayout>
  );
};

export default WeeklyBusinessReviewPage;
