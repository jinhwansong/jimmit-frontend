'use client';
import CardItem from '@/components/commons/Card/CardItem';
import CardSkeleton from '@/components/commons/Card/SkeletonItem';
import InfinityScroll from '@/components/commons/InfinityScroll';
import { CARD_STATE } from '@/constants/card';
import { useReviewToWriteInfiniteQuery } from '@/hooks/queries/review/usePrefetchReview';
import { useUserStore } from '@/stores/useUserStore';

export default function ReviewsToWrite() {
  const { user, isLoaded, isRefreshing } = useUserStore();
  const isQueryReady = isLoaded && !isRefreshing && !!user;

  const { data, fetchNextPage, hasNextPage, isFetching } =
    useReviewToWriteInfiniteQuery({
      size: 8,
      includeCanceled: false,
      enabled: isQueryReady,
    });
  if (!data) {
    return (
      <div className="pc:grid-cols-4 pc:gap-x-5 pc:px-0 tab:px-6 grid grid-cols-1 gap-y-10 px-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const flatData = data?.pages.flatMap((page) => page.gatherings) ?? [];
  const completedData = flatData.filter((item) => item.status === 'COMPLETED');
  return (
    <>
      <InfinityScroll
        list={completedData}
        item={(item, index) => (
          <CardItem
            item={item}
            status={CARD_STATE.ENSEMBLE}
            page="towrite"
            isFirst={index === 0}
          />
        )}
        emptyText="리뷰가능한 모임이 없습니다."
        hasMore={!!hasNextPage && !isFetching}
        onInView={() => {
          if (hasNextPage && !isFetching) {
            fetchNextPage();
          }
        }}
      />
    </>
  );
}
