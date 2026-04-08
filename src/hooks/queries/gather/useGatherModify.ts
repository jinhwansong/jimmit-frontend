import { putModifiedGatherings } from '@/lib/gathering/modified';
import { useToastStore } from '@/stores/useToastStore';
import { handleAuthApiError } from '@/utils/authApiError';
import { useMutation } from '@tanstack/react-query';

export const useGatherModify = () =>
  useMutation({
    mutationFn: putModifiedGatherings,

    onSuccess: () => {
      useToastStore.getState().show('모임 수정 완료되었습니다.');
    },

    onError: (error) => {
      handleAuthApiError(error, '모임 수정에 실패했습니다.');
    },
  });
