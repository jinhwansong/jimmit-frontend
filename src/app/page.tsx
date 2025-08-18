import RecruitPage from '@/components/products/recruit/RecruitPage';
import { prefetchCommonInfiniteQuery } from '@/hooks/queries/recruit/useRecruit';
import { BandSession, Genre } from '@/types/tags';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JAMMIT - 밴드 모임 플랫폼 | 홈',
  description:
    'JAMMIT에서 밴드원을 찾고, 모임을 만들고, 음악을 공유하세요. 다양한 밴드 모임을 둘러보고 참여해보세요.',
};

interface HomeProps {
  searchParams: Promise<{
    showShareModal?: string;
    groupId?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = await searchParams;
  const queryClient = new QueryClient();
  const defaultGenres: Genre[] = [];
  const defaultSessions: BandSession[] = [];
  const defaultSort = 'recruitDeadline,desc';

  await prefetchCommonInfiniteQuery({
    queryClient,
    genres: defaultGenres,
    sessions: defaultSessions,
    size: 8,
    sort: defaultSort,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RecruitPage
        defaultSort={defaultSort}
        defaultGenres={defaultGenres}
        defaultSessions={defaultSessions}
        showShareModal={resolvedSearchParams.showShareModal === 'true'}
        shareGroupId={resolvedSearchParams.groupId}
      />
    </HydrationBoundary>
  );
}
