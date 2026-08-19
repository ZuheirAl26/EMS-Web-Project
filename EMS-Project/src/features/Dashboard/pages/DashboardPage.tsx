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

      {/* Grid: Leads Chart on Left, Review Statistics on Right */}
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

      {/* Under the chart grid: Recent 3 Visitors */}
      <RecentVisitorsSection
        isLoading={isLeadsLoading}
        visitors={visitorsList}
      />

      {/* Announcements */}
      <AnnouncementsSection
        announcementsData={announcementsData}
        isLoading={isAnnouncementsLoading}
      />

      {/* Other / Bottom Details */}
      <BottomDetailsSection
        isLoading={isSingleBoothLoading}
        mode={mode}
        singleBooth={singleBooth}
      />
    </section>
  );
}

export default DashboardPage;

