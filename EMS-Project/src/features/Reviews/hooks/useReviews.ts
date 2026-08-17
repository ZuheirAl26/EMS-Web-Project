import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getEventsLookupApi,
  getEventReviewsApi,
  getBoothReviewsApi,
} from "../api/reviewsApi";
import { getBoothLookupApi } from "../../Team&Staff/api/teamApi";
import type { LookupEntity } from "../../Team&Staff/types/teamsType";
import type { ReviewTargetType } from "../types/reviewsType";

export const reviewKeys = {
  all: ["reviews"] as const,
  eventsLookup: () => [...reviewKeys.all, "events-lookup"] as const,
  boothsLookup: () => [...reviewKeys.all, "booths-lookup"] as const,
  reviews: (type: ReviewTargetType, id: number | "", page: number) =>
    [...reviewKeys.all, type, id, page] as const,
};

export function useReviews() {
  const { t } = useTranslation();
  const [targetType, setTargetType] = useState<ReviewTargetType>("event");
  const [selectedEntityId, setSelectedEntityId] = useState<number | "">("");
  const [page, setPage] = useState<number>(1);

  // Lookups
  const eventsLookupQuery = useQuery({
    queryKey: reviewKeys.eventsLookup(),
    queryFn: getEventsLookupApi,
  });

  const boothsLookupQuery = useQuery({
    queryKey: reviewKeys.boothsLookup(),
    queryFn: getBoothLookupApi,
  });

  const eventsList: LookupEntity[] = useMemo(
    () => eventsLookupQuery.data || [],
    [eventsLookupQuery.data],
  );

  const boothsList: LookupEntity[] = useMemo(
    () => boothsLookupQuery.data || [],
    [boothsLookupQuery.data],
  );

  // Active target options list
  const activeLookupList = targetType === "event" ? eventsList : boothsList;

  // Active default entity ID
  const activeEntityId = useMemo(() => {
    if (selectedEntityId !== "") return selectedEntityId;
    if (activeLookupList.length > 0) return activeLookupList[0].id;
    return "";
  }, [selectedEntityId, activeLookupList]);

  // Handle target type change
  const handleTargetTypeChange = (newType: ReviewTargetType) => {
    setTargetType(newType);
    setSelectedEntityId("");
    setPage(1);
  };

  // Handle entity change
  const handleEntityChange = (id: number | "") => {
    setSelectedEntityId(id);
    setPage(1);
  };

  // Reviews query
  const reviewsQuery = useQuery({
    queryKey: reviewKeys.reviews(targetType, activeEntityId, page),
    queryFn: async () => {
      if (!activeEntityId) return null;
      if (targetType === "event") {
        return getEventReviewsApi(Number(activeEntityId), page);
      } else {
        return getBoothReviewsApi(Number(activeEntityId), page);
      }
    },
    enabled: Boolean(activeEntityId),
  });

  const isPageLoading =
    eventsLookupQuery.isLoading || boothsLookupQuery.isLoading;

  const isReviewsLoading = reviewsQuery.isLoading;

  const statistics = reviewsQuery.data?.statistics || {
    total_reviews: 0,
    average_rating: 0,
    five_star_reviews: 0,
  };

  const reviewsData = reviewsQuery.data?.reviews;
  const reviewsList = reviewsData?.data || [];
  const pagination = reviewsData
    ? {
        current_page: reviewsData.current_page,
        per_page: reviewsData.per_page,
        total: reviewsData.total,
        last_page: reviewsData.last_page,
      }
    : null;

  return {
    targetType,
    handleTargetTypeChange,
    selectedEntityId: activeEntityId,
    handleEntityChange,
    eventsList,
    boothsList,
    activeLookupList,
    statistics,
    reviewsList,
    pagination,
    page,
    setPage,
    isPageLoading,
    isReviewsLoading,
    isError: reviewsQuery.isError,
    refetch: reviewsQuery.refetch,
  };
}
