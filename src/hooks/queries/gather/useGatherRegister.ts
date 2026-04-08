import { postRegisterGatherings } from '@/lib/gathering/register';
import { useToastStore } from '@/stores/useToastStore';
import {
  RegisterGatheringsRequest,
  RegisterGatheringsResponse,
} from '@/types/gather';
import { handleAuthApiError } from '@/utils/authApiError';
import { useMutation } from '@tanstack/react-query';

export const useGatherRegister = () => {
  return useMutation<
    RegisterGatheringsResponse,
    Error,
    RegisterGatheringsRequest
  >({
    mutationFn: postRegisterGatherings,
    onSuccess: () => {
      useToastStore.getState().show('모임이 성공적으로 생성되었습니다.');
    },
    onError: (error) => {
      handleAuthApiError(error, '모임생성에 실패했습니다.');
    },
  });
};
