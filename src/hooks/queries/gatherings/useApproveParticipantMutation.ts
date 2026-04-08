import { approveParticipant } from '@/lib/gatherings/gatherings';
import { useToastStore } from '@/stores/useToastStore';
import { handleAuthApiError } from '@/utils/authApiError';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gatheringKeys } from '../queryKeys';

export const useApproveParticipantMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      gatheringId,
      participantId,
    }: {
      gatheringId: number;
      participantId: number;
    }) => approveParticipant(gatheringId, participantId),
    onSuccess: (data, { gatheringId }) => {
      useToastStore.getState().show('참가가 승인되었습니다.');
      queryClient.invalidateQueries({
        queryKey: gatheringKeys.details(gatheringId).participants,
      });
      queryClient.invalidateQueries({
        queryKey: gatheringKeys.details(gatheringId).detail,
      });
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey &&
          query.queryKey[0] === 'gatherings' &&
          query.queryKey[1] === 'list',
      });
    },
    onError: (error) => {
      handleAuthApiError(error, '참가 승인 실패했습니다.');
    },
  });
};
