'use client';
import AuthCard from '@/components/commons/AuthCard';
import Button from '@/components/commons/Button';
import Input from '@/components/commons/Input';
import Checkbox from '@/assets/icons/ic_checkbox.svg';
import CheckboxEmpty from '@/assets/icons/ic_checkbox_empty.svg';
import { useLoginMutation } from '@/hooks/queries/auth/useLoginMutaion';
import { useToastStore } from '@/stores/useToastStore';
import { handleAuthApiError } from '@/utils/authApiError';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

interface FormValues {
  email: string;
  password: string;
}

const STORAGE_KEY = 'savedEmail';

export default function LoginPage() {
  const router = useRouter();
  const methods = useForm<FormValues>({
    mode: 'all',
    defaultValues: { email: '', password: '' },
    shouldUnregister: false,
  });
  const {
    formState: { isValid },
    setValue,
    reset,
  } = methods;
  const { mutateAsync } = useLoginMutation();
  const [saveEmail, setSaveEmail] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setValue('email', saved);
      setSaveEmail(true);
    }
  }, [setValue]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      await mutateAsync(data);

      if (saveEmail) {
        localStorage.setItem(STORAGE_KEY, data.email);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }

      useToastStore.getState().show('로그인 성공!');
      router.push('/');
      reset();
    } catch (error) {
      handleAuthApiError(error, '로그인에 실패했습니다.');
    }
  };

  return (
    <AuthCard title="로그인" linkTo="signup">
      <div className="tab:w-[25.125rem] flex w-[19.4375rem] flex-col items-center">
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            noValidate
            className="w-full"
          >
            <div className="flex flex-col gap-[1.5rem]">
              <Input
                name="email"
                type="text"
                label="아이디"
                placeholder="이메일을 입력해주세요."
                rules={{
                  required: '이메일은 필수 입력입니다.',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: '올바른 이메일 형식을 입력해주세요.',
                  },
                }}
              />
              <Input
                name="password"
                type="password"
                label="비밀번호"
                placeholder="비밀번호를 입력해주세요."
                rules={{
                  required: '비밀번호는 필수 입력입니다.',
                  minLength: {
                    value: 8,
                    message: '비밀번호는 최소 8자 이상이어야 합니다.',
                  },
                }}
              />
            </div>
            <div className="mt-[1.5rem] flex items-center gap-2">
              <div
                onClick={() => setSaveEmail((prev) => !prev)}
                className="cursor-pointer"
              >
                {saveEmail ? <Checkbox /> : <CheckboxEmpty />}
              </div>
              <label
                onClick={() => setSaveEmail((prev) => !prev)}
                className="cursor-pointer text-sm text-[0.938rem] font-medium text-gray-400"
              >
                아이디 저장
              </label>
            </div>
            <Button
              variant="solid"
              size="large"
              className="mt-[1.5rem] w-full"
              type="submit"
              disabled={!isValid}
            >
              로그인
            </Button>
          </form>
        </FormProvider>
      </div>
    </AuthCard>
  );
}
