import { cancelParticipateGathering } from '@/lib/gatherings/gatherings';
import { useToastStore } from '@/stores/useToastStore';
import { handleAuthApiError } from '@/utils/authApiError';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gatheringKeys } from '../queryKeys';

export const useCancelParticipateGatheringMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      gatheringId,
      participantId,
    }: {
      gatheringId: number;
      participantId: number;
    }) => cancelParticipateGathering(gatheringId, participantId),
    onSuccess: (data) => {
      useToastStore.getState().show(data.message);
      queryClient.invalidateQueries({
        queryKey: gatheringKeys.details(data.gatheringId).detail,
      });
      queryClient.invalidateQueries({
        queryKey: gatheringKeys.details(data.gatheringId).participants,
      });
    },
    onError: (error) => {
      handleAuthApiError(error, '참여 취소 중 문제가 발생했습니다.');
    },
  });
};
