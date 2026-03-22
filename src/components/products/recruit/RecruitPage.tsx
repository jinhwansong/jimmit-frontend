'use client';
import CardItem from '@/components/commons/Card/CardItem';
import SkeletonItem from '@/components/commons/Card/SkeletonItem';
import RecruitHeader from '@/components/commons/RecruitHeader';
import dynamic from 'next/dynamic';

const InfinityScroll = dynamic(
  () => import('@/components/commons/InfinityScroll'),
  {
    ssr: false,
    loading: () => (
      <div className="pc:grid-cols-4 pc:gap-x-5 pc:px-0 tab:px-6 grid grid-cols-1 gap-y-10 px-4">
        {[...Array(8)].map((_, i) => (
          <SkeletonItem key={i} />
        ))}
      </div>
    ),
  },
);

const ShareLinkModal = dynamic(
  () => import('@/components/products/group/ShareLinkModal'),
  { ssr: false },
);
import { CARD_STATE } from '@/constants/card';
import { useCommonInfiniteQuery } from '@/hooks/queries/recruit/useRecruit';
import { RecruitPageProps } from '@/types/recruit';
import { GatheringCard } from '@/types/card';
import { BandSession, Genre } from '@/types/tags';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export default function RecruitPage({
  defaultGenres,
  defaultSessions,
  showShareModal = false,
  shareGroupId,
  defaultSort,
}: RecruitPageProps) {
  // 장르, 세션
  const [genres, setGenres] = useState<Genre[]>(defaultGenres);
  const [sessions, setSessions] = useState<BandSession[]>(defaultSessions);
  const [sort, setSort] = useState<string>(defaultSort as string);
  const [isShareModalOpen, setIsShareModalOpen] = useState(showShareModal);
  const router = useRouter();

  const filters = useMemo(
    () => ({
      size: 8,
      sort,
      genres,
      sessions,
    }),
    [sort, genres, sessions],
  );

  const { data, fetchNextPage, hasNextPage, isFetching } =
    useCommonInfiniteQuery(filters);
  const flatData = data?.pages.flatMap((page) => page.gatherings) ?? [];

  const handleModalClose = () => {
    setIsShareModalOpen(false);
    const url = new URL(window.location.href);
    url.searchParams.delete('showShareModal');
    url.searchParams.delete('groupId');
    router.replace(url.pathname);
  };
  useEffect(() => {
    setIsShareModalOpen(showShareModal);
  }, [showShareModal]);
  const isInitialLoading = !data && isFetching;
  return (
    <>
      <div className="pc:max-w-[84rem] pc:mt-8 pc:pb-[5rem] mx-auto max-w-full pb-[1.375rem]">
        <RecruitHeader
          genres={genres}
          setGenres={setGenres}
          sessions={sessions}
          setSessions={setSessions}
          setSort={setSort}
          sort={sort}
          defaultGenres={defaultGenres}
          defaultSessions={defaultSessions}
        />
        <InfinityScroll
          isInitialLoading={isInitialLoading}
          skeletonItem={<SkeletonItem />}
          list={flatData}
          item={(item, index) => (
            <CardItem
              item={item as GatheringCard}
              isLike={true}
              status={CARD_STATE.PROGRESS}
              isFirst={index === 0}
            />
          )}
          emptyText="해당 모임이 존재하지 않습니다."
          hasMore={!!hasNextPage && !isFetching}
          onInView={() => {
            if (hasNextPage && !isFetching) {
              fetchNextPage();
            }
          }}
        />
      </div>

      {isShareModalOpen && shareGroupId && (
        <ShareLinkModal
          inviteLink={`https://www.jimmit.store/group/${shareGroupId}`}
          onClose={handleModalClose}
        />
      )}
    </>
  );
}
