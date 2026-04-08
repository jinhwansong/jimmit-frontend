import { postParticipateGatherings } from '@/lib/gatherings/gatherings';
import { BandSessionType } from '@/types/tags';
import { handleAuthApiError } from '@/utils/authApiError';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gatheringKeys } from '../queryKeys';

interface ParticipateGatheringParams {
  id: number;
  bandSession: BandSessionType;
  introduction: string;
}

export const useParticipateGatheringMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      bandSession,
      introduction,
    }: ParticipateGatheringParams) =>
      postParticipateGatherings(id, bandSession, introduction),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: gatheringKeys.details(data.gatheringId).detail,
      });
      queryClient.invalidateQueries({
        queryKey: gatheringKeys.details(data.gatheringId).participants,
      });
    },
    onError: (error) => {
      handleAuthApiError(error, '모임 참여 신청 중 문제가 발생했어요.');
    },
  });
};
