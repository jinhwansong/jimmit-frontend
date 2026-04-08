'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { GatheringCard } from '@/types/card';
import { GatheringsResponse, GetUserGatheringsParams } from '@/types/gather';
import SkeletonGatheringList from './SkeletonGatheringList';
import { useUserStore } from '@/stores/useUserStore';

interface UseGatheringHook {
  (params: GetUserGatheringsParams): {
    data?: GatheringsResponse;
    isError?: boolean;
    error?: Error | null;
    enabled?: boolean;
  };
}

interface RenderComponentProps {
  gatherings: GatheringCard[];
  currentPage: number;
  totalPage: number;
  onLoadMore: () => void;
}

interface GatheringListProps {
  size?: number;
  includeCanceled?: boolean;
  onCountChange?: (count: number) => void;
  useHook: UseGatheringHook;
  renderComponent: React.ComponentType<RenderComponentProps>;
}

export default function GatheringList({
  size = 8,
  includeCanceled = true,
  useHook,
  renderComponent: RenderComponent,
}: GatheringListProps) {
  const [page, setPage] = useState(0);
  const [list, setList] = useState<GatheringCard[]>([]);
  const { user, isLoaded, isRefreshing } = useUserStore();
  const isQueryReady = isLoaded && !isRefreshing && !!user;

  const params = useMemo(
    () => ({ page, size, includeCanceled, enabled: isQueryReady }),
    [page, size, includeCanceled, isQueryReady],
  );
  const { data, isError } = useHook(params);

  useEffect(() => {
    if (data) {
      setList((prev) =>
        page === 0 ? data.gatherings : [...prev, ...data.gatherings],
      );
    }
  }, [page, data]);

  const loadMore = useCallback(() => {
    if (page + 1 < (data?.totalPage ?? 1)) {
      setPage((prev) => prev + 1);
    }
  }, [page, data?.totalPage]);

  if (!data && !isError) {
    return <SkeletonGatheringList />;
  }

  return (
    <RenderComponent
      gatherings={list}
      currentPage={page}
      totalPage={data?.totalPage ?? 1}
      onLoadMore={loadMore}
    />
  );
}
