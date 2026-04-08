import { rejectParticipant } from '@/lib/gatherings/gatherings';
import { useToastStore } from '@/stores/useToastStore';
import { handleAuthApiError } from '@/utils/authApiError';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gatheringKeys } from '../queryKeys';

export const useRejectParticipantMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      gatheringId,
      participantId,
    }: {
      gatheringId: number;
      participantId: number;
    }) => rejectParticipant(gatheringId, participantId),
    onSuccess: (data, { gatheringId }) => {
      useToastStore.getState().show('참가 거절 처리되었습니다.');
      queryClient.invalidateQueries({
        queryKey: gatheringKeys.details(gatheringId).participants,
      });
      queryClient.invalidateQueries({
        queryKey: gatheringKeys.details(gatheringId).detail,
      });
    },
    onError: (error) => {
      handleAuthApiError(error, '참가 거절 중 오류가 발생했습니다.');
    },
  });
};
