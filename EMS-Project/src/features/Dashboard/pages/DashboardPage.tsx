import { useDashboard } from "../hooks/useDashboard";
import { DashboardHeader } from "../components/DashboardHeader/DashboardHeader";
import { DashboardStatsCards } from "../components/DashboardStatsCards/DashboardStatsCards";
import { LeadsChartSection } from "../components/LeadsChartSection/LeadsChartSection";
import { AnnouncementsSection } from "../components/AnnouncementsSection/AnnouncementsSection";
import { DashboardReviewsSection } from "../components/DashboardReviewsSection/DashboardReviewsSection";
import { BottomDetailsSection } from "../components/BottomDetailsSection/BottomDetailsSection";
import "./DashboardPage.scss";

export function DashboardPage() {
  const {
    mode,
    setMode,
    profile,
    boothsList,
    eventsList,
    activeBoothId,
    activeEventId,
    handleBoothChange,
    handleEventChange,
    singleBooth,
    isSingleBoothLoading,
    boothStats,
    isBoothStatsLoading,
    leadsData,
    isLeadsLoading,
    reviewsData,
    isReviewsLoading,
    announcementsData,
    isAnnouncementsLoading,
  } = useDashboard();

  return (
    <section aria-label="Exhibitor Dashboard" className="dashboard-page">
      <DashboardHeader
        activeBoothId={activeBoothId}
        activeEventId={activeEventId}
        boothsList={boothsList}
        eventsList={eventsList}
        exhibitorName={profile?.name}
        mode={mode}
        onBoothChange={handleBoothChange}
        onEventChange={handleEventChange}
        onModeChange={setMode}
        singleBooth={singleBooth}
      />

      <DashboardStatsCards
        isLoading={isBoothStatsLoading}
        mode={mode}
        stats={boothStats}
      />

      <LeadsChartSection
        isLoading={isLeadsLoading}
        leadsData={leadsData}
      />

      <AnnouncementsSection
        announcementsData={announcementsData}
        isLoading={isAnnouncementsLoading}
      />

      <DashboardReviewsSection
        isLoading={isReviewsLoading}
        reviewsData={reviewsData}
      />

      <BottomDetailsSection
        isLoading={isSingleBoothLoading}
        mode={mode}
        singleBooth={singleBooth}
      />
    </section>
  );
}

export default DashboardPage;
