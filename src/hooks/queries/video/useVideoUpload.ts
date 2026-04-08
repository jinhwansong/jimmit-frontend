import { gether, uploadVideo } from '@/lib/video/videoUpload';
import { GetGetherItem } from '@/types/video';
import { handleAuthApiError } from '@/utils/authApiError';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { videoKeys } from '../queryKeys';

export const useVideoUploadMutation = (
  setProgress: (progress: number) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      title: string;
      description: string;
      videoFile: File;
      accessToken: string;
      slug: number;
      creatorTitle: string;
      creatorName: string;
      thumbnailUrl: string;
    }) => uploadVideo({ ...payload, onProgress: setProgress }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes('videos'),
      });
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes('videosCount'),
      });
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === 'videos' && query.queryKey[1] === 'list',
      });
    },
    onError: (error) => {
      handleAuthApiError(error, '업로드 중 문제가 발생했습니다.');
    },
  });
};

export const useGather = (enabled: boolean) => {
  return useQuery<GetGetherItem[]>({
    queryKey: videoKeys.gether(),
    queryFn: () => gether(),
    enabled: enabled,
  });
};
