import { useDashboard } from "../hooks/useDashboard";
import { DashboardHeader } from "../components/DashboardHeader/DashboardHeader";
import { DashboardStatsCards } from "../components/DashboardStatsCards/DashboardStatsCards";
import { LeadsChartSection } from "../components/LeadsChartSection/LeadsChartSection";
import { DashboardReviewsSection } from "../components/DashboardReviewsSection/DashboardReviewsSection";
import { RecentVisitorsSection } from "../components/RecentVisitorsSection/RecentVisitorsSection";
import { AnnouncementsSection } from "../components/AnnouncementsSection/AnnouncementsSection";
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
    reviewStats,
    isReviewStatsLoading,
    announcementsData,
    isAnnouncementsLoading,
  } = useDashboard();

  const visitorsList = leadsData?.visitors?.data || [];

  return (
    <section aria-label="Exhibitor Dashboard" className="dashboard-page">
      {/* 1. Header */}
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

      {/* 2. Cards */}
      <DashboardStatsCards
        isLoading={isBoothStatsLoading}
        mode={mode}
        stats={boothStats}
      />

      {/* 3. Chart with Rating */}
      <div className="dashboard-middle-grid">
        <LeadsChartSection
          isLoading={isLeadsLoading}
          leadsData={leadsData}
        />
        <DashboardReviewsSection
          isLoading={isReviewStatsLoading}
          stats={reviewStats}
        />
      </div>

      {/* 4. Announcement */}
      <AnnouncementsSection
        announcementsData={announcementsData}
        isLoading={isAnnouncementsLoading}
      />

      {/* 5. Booth details with visitors (Same Row Grid) */}
      <div className="dashboard-bottom-grid">
        <BottomDetailsSection
          isLoading={isSingleBoothLoading}
          mode={mode}
          singleBooth={singleBooth}
        />
        <RecentVisitorsSection
          isLoading={isLeadsLoading}
          visitors={visitorsList}
        />
      </div>
    </section>
  );
}

export default DashboardPage;

