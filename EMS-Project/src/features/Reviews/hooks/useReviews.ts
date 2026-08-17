import { useState, useMemo } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  getEventsLookupApi,
  getEventReviewsApi,
  getBoothReviewsApi,
} from "../api/reviewsApi";
import { getBoothLookupApi } from "../../Team&Staff/api/teamApi";
import type { LookupEntity } from "../../Team&Staff/types/teamsType";
import type { ReviewTargetType } from "../types/reviewsType";
import { exportReviewsToXlsx } from "../utils/exportReviews";

export const reviewKeys = {
  all: ["reviews"] as const,
  eventsLookup: () => [...reviewKeys.all, "events-lookup"] as const,
  boothsLookup: () => [...reviewKeys.all, "booths-lookup"] as const,
  reviews: (
    type: ReviewTargetType,
    id: number | "",
    page: number,
    rating: number | null,
  ) => [...reviewKeys.all, type, id, page, rating] as const,
};

const STALE_TIME_2_MIN = 1000 * 60 * 2;

export function useReviews() {
  const { t } = useTranslation();
  const [targetType, setTargetType] = useState<ReviewTargetType>("event");
  const [selectedEntityId, setSelectedEntityId] = useState<number | "">("");
  const [page, setPage] = useState<number>(1);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  // Lookups
  const eventsLookupQuery = useQuery({
    queryKey: reviewKeys.eventsLookup(),
    queryFn: getEventsLookupApi,
    staleTime: STALE_TIME_2_MIN,
  });

  const boothsLookupQuery = useQuery({
    queryKey: reviewKeys.boothsLookup(),
    queryFn: getBoothLookupApi,
    staleTime: STALE_TIME_2_MIN,
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
    setRatingFilter(null);
  };

  // Handle entity change
  const handleEntityChange = (id: number | "") => {
    setSelectedEntityId(id);
    setPage(1);
    setRatingFilter(null);
  };

  // Handle rating filter change
  const handleRatingFilterChange = (rating: number | null) => {
    setRatingFilter(rating);
    setPage(1);
  };

  // Reviews query
  const reviewsQuery = useQuery({
    queryKey: reviewKeys.reviews(
      targetType,
      activeEntityId,
      page,
      ratingFilter,
    ),
    queryFn: async () => {
      if (!activeEntityId) return null;
      if (targetType === "event") {
        return getEventReviewsApi(Number(activeEntityId), page, ratingFilter);
      } else {
        return getBoothReviewsApi(Number(activeEntityId), page, ratingFilter);
      }
    },
    enabled: Boolean(activeEntityId),
    placeholderData: keepPreviousData,
    staleTime: STALE_TIME_2_MIN,
  });

  const isPageLoading =
    eventsLookupQuery.isLoading || boothsLookupQuery.isLoading;

  const isReviewsLoading = reviewsQuery.isLoading || reviewsQuery.isFetching;

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

  const handleExport = () => {
    const selectedEntity = activeLookupList.find(
      (item) => Number(item.id) === Number(activeEntityId),
    );
    const targetTitle =
      selectedEntity?.label ||
      selectedEntity?.name ||
      `${targetType}_${activeEntityId}`;
    exportReviewsToXlsx(reviewsList, targetTitle, ratingFilter);
  };

  return {
    targetType,
    handleTargetTypeChange,
    selectedEntityId: activeEntityId,
    handleEntityChange,
    ratingFilter,
    handleRatingFilterChange,
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
    handleExport,
    t,
  };
}
