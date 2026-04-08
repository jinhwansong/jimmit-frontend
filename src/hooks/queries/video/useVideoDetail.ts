import {
  getComment,
  getLikeStatus,
  getVideoDetail,
  postComment,
  postLike,
  postView,
} from '@/lib/video/videoDetail';
import { useAuthStore } from '@/stores/useAuthStore';
import { CommentResponse, LikeStatus } from '@/types/video';
import { handleAuthApiError } from '@/utils/authApiError';
import {
  QueryClient,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { videoKeys } from '../queryKeys';

export const prefetchVideoQuery = ({
  queryClient,
  videoId,
}: {
  queryClient: QueryClient;
  videoId: string;
}) => {
  return queryClient.fetchQuery({
    queryKey: videoKeys.detail(videoId),
    queryFn: async () => {
      const viewResp = await postView({ videoId });
      const detail = await getVideoDetail({ videoId });

      return {
        ...detail,
        viewCount: viewResp.viewCount,
      };
    },
    staleTime: 1000 * 60 * 5,
  });
};
export const useVideoDetailQuery = ({ videoId }: { videoId: string }) => {
  return useQuery({
    queryKey: videoKeys.detail(videoId),
    queryFn: () => getVideoDetail({ videoId }),
    staleTime: 1000 * 60 * 5,
  });
};

export const useLikeStatus = ({ videoId }: { videoId: string }) => {
  const { accessToken } = useAuthStore();
  return useQuery({
    queryKey: videoKeys.likeStatus(videoId),
    queryFn: () => getLikeStatus({ videoId }),
    enabled: !!accessToken,
  });
};

export const useLikeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ videoId }: { videoId: string }) => postLike({ videoId }),
    onMutate: async ({ videoId }) => {
      await queryClient.cancelQueries({
        queryKey: videoKeys.likeStatus(videoId),
      });
      const previousLikeStatus = queryClient.getQueryData<LikeStatus>(
        videoKeys.likeStatus(videoId),
      );
      if (previousLikeStatus) {
        queryClient.setQueryData<LikeStatus>(videoKeys.likeStatus(videoId), {
          liked: !previousLikeStatus.liked,
          likeCount:
            previousLikeStatus.likeCount + (previousLikeStatus.liked ? -1 : 1),
        });
      }
      return { previousLikeStatus, videoId };
    },
    onError: (error, variables, context) => {
      if (context?.previousLikeStatus) {
        queryClient.setQueryData(
          videoKeys.likeStatus(context.videoId),
          context.previousLikeStatus,
        );
      }
      handleAuthApiError(error, '좋아요 중 오류가 발생했습니다.');
    },

    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: videoKeys.likeStatus(variables.videoId),
      });
    },
  });
};

export const useCommentQuery = ({
  videoId,
  take,
}: {
  videoId: string;
  take: number;
}) => {
  return useInfiniteQuery({
    queryKey: videoKeys.comment({ take, videoId }),
    queryFn: ({ pageParam = 1 }) => getComment({ pageParam, take, videoId }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: CommentResponse) =>
      lastPage.page + 1 < lastPage.totalPage ? lastPage.page + 1 : undefined,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCommentMutation = (videoId: string, take = 10) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => postComment({ videoId, content }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: videoKeys.comment({ videoId, take }),
        exact: true,
      });
    },
    onError: (error) => {
      handleAuthApiError(error, '댓글작성 중 오류가 발생했습니다.');
    },
  });
};
