import { deleteGathering } from '@/lib/gatherings/gatherings';
import { useToastStore } from '@/stores/useToastStore';
import { handleAuthApiError } from '@/utils/authApiError';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gatheringKeys } from '../queryKeys';

export const useDeleteGatheringMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteGathering(id),
    onSuccess: (_, id) => {
      useToastStore.getState().show('모임이 성공적으로 취소되었습니다.');
      queryClient.invalidateQueries({
        queryKey: gatheringKeys.details(id).detail,
      });
      queryClient.invalidateQueries({
        queryKey: gatheringKeys.details(id).participants,
      });
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey &&
          query.queryKey[0] === 'me' &&
          query.queryKey[1] === 'gatherings' &&
          query.queryKey[2] === 'created',
      });
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey &&
          query.queryKey[0] === 'gatherings' &&
          query.queryKey[1] === 'list',
      });
    },
    onError: (error) => {
      handleAuthApiError(error, '모임 삭제 중 오류가 발생했습니다.');
    },
  });
};
