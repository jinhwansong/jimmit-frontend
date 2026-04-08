'use client';
import AuthCard from '@/components/commons/AuthCard';
import Button from '@/components/commons/Button';
import Input from '@/components/commons/Input';
import { PASSWORD_RULE } from '@/constants/regex';
import { useSendCodeMutation } from '@/hooks/queries/auth/useSendCodeMutation';
import { useVerifyCodeMutation } from '@/hooks/queries/auth/useVerifyCodeMutation';
import { checkEmailDuplicate } from '@/lib/auth/signup';
import { useSignupStore } from '@/stores/useSignupStore';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useWatch,
} from 'react-hook-form';

interface FormValues {
  email: string;
  name: string;
  password: string;
}

export default function SignUpStep1Page() {
  const router = useRouter();
  const methods = useForm<FormValues>({
    mode: 'all',
    defaultValues: { email: '', name: '', password: '' },
    shouldUnregister: false,
  });

  const {
    formState: { isValid, isSubmitting, errors },
    watch,
    setError,
    clearErrors,
  } = methods;

  const email = useWatch({ name: 'email', control: methods.control });
  const code = useWatch({ name: 'name', control: methods.control });
  const password = watch('password');

  const [checking, setChecking] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState<boolean | null>(null);
  const [duplicateMessage, setDuplicateMessage] = useState<string | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const isValidEmailFormat = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const checkEmail = useCallback(async (emailToCheck: string) => {
    setChecking(true);
    try {
      const exists = await checkEmailDuplicate(emailToCheck);
      setIsDuplicate(exists);
      if (exists) {
        setDuplicateMessage('이미 사용 중인 이메일입니다.');
      } else {
        setDuplicateMessage('사용 가능한 이메일입니다.');
      }
    } catch {
      setDuplicateMessage('중복 검사 중 오류가 발생했습니다.');
      setIsDuplicate(null);
    } finally {
      setChecking(false);
    }
  }, []);

  const debounceCheckEmail = useMemo(
    () => debounce(checkEmail, 500),
    [checkEmail],
  );

  const sendCodeMutation = useSendCodeMutation();
  const verifyCodeMutation = useVerifyCodeMutation();

  useEffect(() => {
    if (!email) {
      setDuplicateMessage(null);
      setIsEmailVerified(false);
      return;
    }
    const isValidFormat = isValidEmailFormat(email);
    if (!isValidFormat) {
      setDuplicateMessage(null);
      setIsDuplicate(null);
      setIsEmailVerified(false);
      return;
    }

    debounceCheckEmail(email);
    return () => {
      debounceCheckEmail.cancel();
    };
  }, [email, setError, clearErrors, debounceCheckEmail]);

  useEffect(() => {
    setIsEmailVerified(false);
  }, [email]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    useSignupStore.getState().setStep1Data(data);
    router.push('/signup/step2');
  };

  const handleEmailSendClick = () => {
    sendCodeMutation.mutate({ email });
  };

  const handleEmailVerifyClick = () => {
    verifyCodeMutation.mutate(
      { email, code },
      {
        onSuccess: (data) => {
          if (data && data.success !== false) {
            setIsEmailVerified(true);
          }
        },
      },
    );
  };

  const isSendButtonDisabled =
    !email ||
    !!errors.email ||
    isSubmitting ||
    checking ||
    Boolean(isDuplicate) ||
    sendCodeMutation.isPending;

  const isVerifyButtonDisabled = !code || !!errors.name || isSubmitting;

  const isNextButtonDisabled =
    !isValid || checking || isDuplicate === true || !isEmailVerified;

  return (
    <AuthCard title="회원가입" linkTo="login">
      <div className="tab:w-[25.125rem] flex w-[19.4375rem] flex-col items-center">
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            noValidate
            className="w-full"
          >
            <div className="flex flex-col gap-[1.5rem]">
              <div>
                <Input
                  name="email"
                  type="text"
                  label="아이디"
                  placeholder="이메일을 입력해주세요."
                  isrightbutton={true}
                  rightButtonDisabled={isSendButtonDisabled}
                  onRightButtonClick={handleEmailSendClick}
                  rules={{
                    required: '이메일은 필수 입력입니다.',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: '올바른 이메일 형식을 입력해주세요.',
                    },
                  }}
                >
                  인증하기
                </Input>
                {duplicateMessage && (
                  <p
                    className={`mt-3 text-sm ${
                      isDuplicate ? 'text-red-500' : 'text-[#bf5eff]'
                    }`}
                  >
                    {duplicateMessage}
                  </p>
                )}
              </div>

              <div>
                <Input
                  name="name"
                  type="text"
                  label="인증번호 입력"
                  placeholder="인증 6자리를 입력해주세요."
                  isrightbutton={true}
                  rightButtonDisabled={isVerifyButtonDisabled}
                  onRightButtonClick={handleEmailVerifyClick}
                  rules={{
                    required: '인증번호는 필수 입력입니다.',
                  }}
                >
                  인증확인
                </Input>
                {isEmailVerified && (
                  <p className="mt-3 text-sm text-[#bf5eff]">
                    이메일 인증이 완료되었습니다.
                  </p>
                )}
              </div>

              <Input
                name="password"
                type="password"
                label="비밀번호"
                placeholder="비밀번호를 입력해주세요."
                rules={PASSWORD_RULE}
              />
              <Input
                name="passwordConfirm"
                type="password"
                label="비밀번호 확인"
                placeholder="비밀번호를 다시 한 번 입력해주세요."
                rules={{
                  required: '비밀번호 확인은 필수 입력입니다.',
                  validate: (value) =>
                    value === password || '비밀번호가 일치하지 않습니다.',
                }}
              />
            </div>
            <Button
              variant="solid"
              size="large"
              className="mt-[2.5rem] w-full"
              type="submit"
              disabled={isNextButtonDisabled}
            >
              {checking ? '확인 중...' : '다음'}
            </Button>
          </form>
        </FormProvider>
      </div>
    </AuthCard>
  );
}
