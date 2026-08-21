import { useState } from "react";
import { useDashboard } from "../hooks/useDashboard";
import { DashboardHeader } from "../components/DashboardHeader/DashboardHeader";
import { DashboardStatsCards } from "../components/DashboardStatsCards/DashboardStatsCards";
import { LeadsChartSection } from "../components/LeadsChartSection/LeadsChartSection";
import { DashboardReviewsSection } from "../components/DashboardReviewsSection/DashboardReviewsSection";
import { RecentVisitorsSection } from "../components/RecentVisitorsSection/RecentVisitorsSection";
import { AnnouncementsSection } from "../components/AnnouncementsSection/AnnouncementsSection";
import { BottomDetailsSection } from "../components/BottomDetailsSection/BottomDetailsSection";
import { VisitorLeadsPanel } from "../components/VisitorLeadsPanel";
import { ReviewerDetailsModal } from "../../Reviews/components/ReviewerDetailsModal";
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
    isSingleBoothError,
    refetchSingleBooth,
    singleEvent,
    isSingleEventLoading,
    isSingleEventError,
    refetchSingleEvent,
    boothStats,
    isBoothStatsLoading,
    leadsData,
    isLeadsLoading,
    isLeadsError,
    refetchLeads,
    reviewStats,
    isReviewStatsLoading,
    isReviewStatsError,
    refetchReviewStats,
    announcementsData,
    isAnnouncementsLoading,
    isAnnouncementsError,
    refetchAnnouncements,
    selectedVisitorForModal,
    setSelectedVisitorForModal,
    handleSelectVisitorLead,
  } = useDashboard();

  const [isAllVisitorsPanelOpen, setIsAllVisitorsPanelOpen] = useState(false);

  const visitorsList = leadsData?.visitors?.data || [];

  const currentBooth = boothsList.find((b) => b.id === activeBoothId);
  const currentEvent = eventsList.find((e) => e.id === activeEventId);
  const activeTargetLabel =
    mode === "booth"
      ? currentBooth?.label ||
        currentBooth?.name ||
        (singleBooth?.number
          ? `Booth #${singleBooth.number}`
          : activeBoothId
            ? `Booth #${activeBoothId}`
            : "Booth")
      : currentEvent?.label ||
        currentEvent?.name ||
        (activeEventId ? `Event #${activeEventId}` : "Event");

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
          isError={isLeadsError}
          leadsData={leadsData}
          onRetry={refetchLeads}
        />
        <DashboardReviewsSection
          isLoading={isReviewStatsLoading}
          isError={isReviewStatsError}
          onRetry={refetchReviewStats}
          stats={reviewStats}
        />
      </div>

      {/* 4. Announcement */}
      <AnnouncementsSection
        announcementsData={announcementsData}
        isLoading={isAnnouncementsLoading}
        isError={isAnnouncementsError}
        onRetry={refetchAnnouncements}
      />

      {/* 5. Booth/Event details with visitors (Same Row Grid) */}
      <div className="dashboard-bottom-grid">
        <BottomDetailsSection
          mode={mode}
          singleBooth={singleBooth}
          isBoothLoading={isSingleBoothLoading}
          isBoothError={isSingleBoothError}
          onRetryBooth={refetchSingleBooth}
          singleEvent={singleEvent}
          isEventLoading={isSingleEventLoading}
          isEventError={isSingleEventError}
          onRetryEvent={refetchSingleEvent}
          hasActiveBooth={Boolean(activeBoothId)}
          hasActiveEvent={Boolean(activeEventId)}
        />
        <RecentVisitorsSection
          isLoading={isLeadsLoading}
          isError={isLeadsError}
          onRetry={refetchLeads}
          visitors={visitorsList}
          onSelectVisitor={handleSelectVisitorLead}
          onViewAll={() => setIsAllVisitorsPanelOpen(true)}
        />
      </div>

      {/* Scrollable All Visitor Leads Drawer / Panel */}
      <VisitorLeadsPanel
        isOpen={isAllVisitorsPanelOpen}
        onClose={() => setIsAllVisitorsPanelOpen(false)}
        mode={mode}
        activeBoothId={activeBoothId}
        activeEventId={activeEventId}
        activeTargetLabel={activeTargetLabel}
        onSelectVisitor={handleSelectVisitorLead}
      />

      {/* Visitor Profile Details Modal */}
      <ReviewerDetailsModal
        isOpen={selectedVisitorForModal !== null}
        onClose={() => setSelectedVisitorForModal(null)}
        reviewer={selectedVisitorForModal || undefined}
        isLoading={false}
      />
    </section>
  );
}

export default DashboardPage;

