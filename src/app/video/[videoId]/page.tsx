import VideoDetailClient from '@/components/products/video/VideoDetailClient';
import { prefetchVideoQuery } from '@/hooks/queries/video/useVideoDetail';
import { getVideoDetail } from '@/lib/video/videoDetail';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { Metadata } from 'next';

type PageProps = {
  params: Promise<{
    videoId: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { videoId } = await params;
  const data = await getVideoDetail({ videoId });

  return {
    title: `JAMMIT · ${data.title}`,
    description: data.description,
    openGraph: {
      title: `JAMMIT · ${data.title}`,
      description: data.description,
      url: `https://www.jimmit.store/video/${data.id}`,
      siteName: 'JAMMIT',
      type: 'video.other',
      images: data.thumbnailUrl,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { videoId } = await params;
  const queryClient = new QueryClient();

  await prefetchVideoQuery({ queryClient, videoId });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <VideoDetailClient videoId={videoId} />
    </HydrationBoundary>
  );
}
