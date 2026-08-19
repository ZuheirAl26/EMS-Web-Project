import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useExhibitorProfile } from "../../ExhibitorProfile/hooks/useExhibitorProfile";
import { getBoothLookupApi } from "../../Team&Staff/api/teamApi";
import { getEventsLookupApi, getBoothReviewsApi, getEventReviewsApi } from "../../Reviews/api/reviewsApi";
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
  boothStats: (id?: number) => [...dashboardKeys.all, "boothStats", id] as const,
  leads: (mode: DashboardScopeMode, id?: number, page?: number) =>
    [...dashboardKeys.all, "leads", mode, id, page] as const,
  announcements: (perPage: number, page?: number) =>
    [...dashboardKeys.all, "announcements", perPage, page] as const,
};

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
  });

  const eventsLookupQuery = useQuery({
    queryKey: ["lookup-events"],
    queryFn: getEventsLookupApi,
  });

  const boothsList = useMemo(() => boothsLookupQuery.data || [], [boothsLookupQuery.data]);
  const eventsList = useMemo(() => eventsLookupQuery.data || [], [eventsLookupQuery.data]);

  // Active Target ID
  const activeBoothId = selectedBoothId ?? (boothsList.length > 0 ? boothsList[0].id : null);
  const activeEventId = selectedEventId ?? (eventsList.length > 0 ? eventsList[0].id : null);

  // Single Booth Details Query
  const singleBoothQuery = useQuery({
    queryKey: dashboardKeys.booth(activeBoothId ?? undefined),
    queryFn: () => getSingleBoothApi(activeBoothId!),
    enabled: Boolean(activeBoothId) && mode === "booth",
  });

  // Booth Statistics Query
  const boothStatsQuery = useQuery({
    queryKey: dashboardKeys.boothStats(activeBoothId ?? undefined),
    queryFn: () => getBoothStatisticsApi(activeBoothId!),
    enabled: Boolean(activeBoothId) && mode === "booth",
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
  });

  // Announcements Query (per_page = 5)
  const announcementsQuery = useQuery({
    queryKey: dashboardKeys.announcements(5, announcementsPage),
    queryFn: () => getAnnouncementsApi(5, announcementsPage),
  });

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
    boothStats: boothStatsQuery.data,
    isBoothStatsLoading: boothStatsQuery.isLoading,
    leadsData: leadsQuery.data,
    isLeadsLoading: leadsQuery.isLoading,
    leadsPage,
    setLeadsPage,
    reviewsData: reviewsQuery.data,
    isReviewsLoading: reviewsQuery.isLoading,
    announcementsData: announcementsQuery.data,
    isAnnouncementsLoading: announcementsQuery.isLoading,
    announcementsPage,
    setAnnouncementsPage,
  };
}
