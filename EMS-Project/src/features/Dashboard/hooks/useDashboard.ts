import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useExhibitorProfile } from "../../ExhibitorProfile/hooks/useExhibitorProfile";
import { getBoothLookupApi } from "../../Team&Staff/api/teamApi";
import {
  getEventsLookupApi,
  getBoothReviewsApi,
  getEventReviewsApi,
  getBoothReviewStatsApi,
  getEventReviewStatsApi,
} from "../../Reviews/api/reviewsApi";
import {
  getSingleBoothApi,
  getBoothStatisticsApi,
  getBoothLeadsApi,
  getEventLeadsApi,
  getAnnouncementsApi,
} from "../api/dashboardApi";
import type { DashboardScopeMode } from "../types/dashboardType";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  booth: (id?: number) => [...dashboardKeys.all, "booth", id] as const,
  boothStats: (id?: number) =>
    [...dashboardKeys.all, "boothStats", id] as const,
  leads: (mode: DashboardScopeMode, id?: number, page?: number) =>
    [...dashboardKeys.all, "leads", mode, id, page] as const,
  announcements: () => [...dashboardKeys.all, "announcements"] as const,
};

const STALE_TIME_2_MIN = 1000 * 60 * 2; // 2 minutes
const GC_TIME_30_MIN = 1000 * 60 * 30; // 30 minutes

export function useDashboard() {
  const [mode, setMode] = useState<DashboardScopeMode>("booth");
  const [selectedBoothId, setSelectedBoothId] = useState<number | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [leadsPage, setLeadsPage] = useState(1);
  const [announcementsPage, setAnnouncementsPage] = useState(1);

  // Profile data for user name
  const profileQuery = useExhibitorProfile();
  const profile = profileQuery.data?.data;

  // Booths & Events Lookup
  const boothsLookupQuery = useQuery({
    queryKey: ["lookup-booths"],
    queryFn: getBoothLookupApi,
    staleTime: STALE_TIME_2_MIN,
    gcTime: GC_TIME_30_MIN,
  });

  const eventsLookupQuery = useQuery({
    queryKey: ["lookup-events"],
    queryFn: getEventsLookupApi,
    staleTime: STALE_TIME_2_MIN,
    gcTime: GC_TIME_30_MIN,
  });

  const boothsList = useMemo(
    () => boothsLookupQuery.data || [],
    [boothsLookupQuery.data],
  );
  const eventsList = useMemo(
    () => eventsLookupQuery.data || [],
    [eventsLookupQuery.data],
  );

  // Active Target ID
  const activeBoothId =
    selectedBoothId ?? (boothsList.length > 0 ? boothsList[0].id : null);
  const activeEventId =
    selectedEventId ?? (eventsList.length > 0 ? eventsList[0].id : null);

  // Single Booth Details Query
  const singleBoothQuery = useQuery({
    queryKey: dashboardKeys.booth(activeBoothId ?? undefined),
    queryFn: () => getSingleBoothApi(activeBoothId!),
    enabled: Boolean(activeBoothId) && mode === "booth",
    staleTime: STALE_TIME_2_MIN,
    gcTime: GC_TIME_30_MIN,
  });

  // Booth Statistics Query
  const boothStatsQuery = useQuery({
    queryKey: dashboardKeys.boothStats(activeBoothId ?? undefined),
    queryFn: () => getBoothStatisticsApi(activeBoothId!),
    enabled: Boolean(activeBoothId) && mode === "booth",
    staleTime: STALE_TIME_2_MIN,
    gcTime: GC_TIME_30_MIN,
  });

  // Leads Query (Booth or Event)
  const activeTargetId = mode === "booth" ? activeBoothId : activeEventId;
  const leadsQuery = useQuery({
    queryKey: dashboardKeys.leads(mode, activeTargetId ?? undefined, leadsPage),
    queryFn: () => {
      if (mode === "booth") {
        return getBoothLeadsApi(activeBoothId!, leadsPage);
      } else {
        return getEventLeadsApi(activeEventId!, leadsPage);
      }
    },
    enabled: Boolean(activeTargetId),
    staleTime: STALE_TIME_2_MIN,
    gcTime: GC_TIME_30_MIN,
  });

  // Reviews Query
  const reviewsQuery = useQuery({
    queryKey: ["dashboard-reviews", mode, activeTargetId],
    queryFn: () => {
      if (mode === "booth") {
        return getBoothReviewsApi(activeBoothId!, 1);
      } else {
        return getEventReviewsApi(activeEventId!, 1);
      }
    },
    enabled: Boolean(activeTargetId),
    staleTime: STALE_TIME_2_MIN,
    gcTime: GC_TIME_30_MIN,
  });

  // Review Stats Query
  const reviewStatsQuery = useQuery({
    queryKey: ["dashboard-review-stats", mode, activeTargetId],
    queryFn: () => {
      if (mode === "booth") {
        return getBoothReviewStatsApi(activeBoothId!);
      } else {
        return getEventReviewStatsApi(activeEventId!);
      }
    },
    enabled: Boolean(activeTargetId),
    staleTime: STALE_TIME_2_MIN,
    gcTime: GC_TIME_30_MIN,
  });

  // Announcements Query (full announcements array)
  const announcementsQuery = useQuery({
    queryKey: dashboardKeys.announcements(),
    queryFn: getAnnouncementsApi,
    staleTime: STALE_TIME_2_MIN,
    gcTime: GC_TIME_30_MIN,
  });

  const [selectedVisitorForModal, setSelectedVisitorForModal] = useState<
    import("../../Reviews/types/reviewsType").ReviewerDetails | null
  >(null);

  const handleSelectVisitorLead = (
    lead: import("../types/dashboardType").VisitorLead,
  ) => {
    const v = lead.visitor;
    if (!v) return;
    const firstName =
      v.first_name ||
      (v.full_name || "").trim().split(/\s+/)[0] ||
      "Visitor";
    const lastName =
      v.last_name ||
      (v.full_name || "").trim().split(/\s+/).slice(1).join(" ") ||
      "";

    setSelectedVisitorForModal({
      id: v.id,
      first_name: firstName,
      last_name: lastName,
      email: v.email || "—",
      phone: v.phone || "—",
      avatar: v.avatar,
      job: v.job || "Exhibition Visitor",
      location: v.location || null,
      birthday: v.birthday || null,
      gender: v.gender || null,
    });
  };

  const handleModeChange = (nextMode: DashboardScopeMode) => {
    setMode(nextMode);
    setLeadsPage(1);
  };

  const handleBoothChange = (boothId: number) => {
    setSelectedBoothId(boothId);
    setLeadsPage(1);
  };

  const handleEventChange = (eventId: number) => {
    setSelectedEventId(eventId);
    setLeadsPage(1);
  };

  return {
    mode,
    setMode: handleModeChange,
    profile,
    boothsList,
    eventsList,
    activeBoothId,
    activeEventId,
    handleBoothChange,
    handleEventChange,
    singleBooth: singleBoothQuery.data,
    isSingleBoothLoading: singleBoothQuery.isLoading,
    isSingleBoothError: singleBoothQuery.isError,
    refetchSingleBooth: singleBoothQuery.refetch,
    boothStats: boothStatsQuery.data,
    isBoothStatsLoading: boothStatsQuery.isLoading,
    isBoothStatsError: boothStatsQuery.isError,
    refetchBoothStats: boothStatsQuery.refetch,
    leadsData: leadsQuery.data,
    isLeadsLoading: leadsQuery.isLoading,
    isLeadsError: leadsQuery.isError,
    refetchLeads: leadsQuery.refetch,
    leadsPage,
    setLeadsPage,
    reviewsData: reviewsQuery.data,
    isReviewsLoading: reviewsQuery.isLoading,
    reviewStats: reviewStatsQuery.data,
    isReviewStatsLoading: reviewStatsQuery.isLoading,
    isReviewStatsError: reviewStatsQuery.isError,
    refetchReviewStats: reviewStatsQuery.refetch,
    announcementsData: announcementsQuery.data,
    isAnnouncementsLoading: announcementsQuery.isLoading,
    isAnnouncementsError: announcementsQuery.isError,
    refetchAnnouncements: announcementsQuery.refetch,
    announcementsPage,
    setAnnouncementsPage,
    selectedVisitorForModal,
    setSelectedVisitorForModal,
    handleSelectVisitorLead,
  };
}
