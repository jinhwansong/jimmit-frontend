'use client';
import AuthCard from '@/components/commons/AuthCard';
import Button from '@/components/commons/Button';
import Input from '@/components/commons/Input';
import ModalInteraction from '@/components/commons/Modal/ModalInteraction';
import ProfileImageUpload from '@/components/commons/ProfileImageUpload';
import TagSection from '@/components/commons/TagSection';
import { GENRE_TAGS, SESSION_TAGS } from '@/constants/tags';
import { GENRE_KR_TO_ENUM, SESSION_KR_TO_ENUM } from '@/constants/tagsMapping';
import { useSignupMutation } from '@/hooks/queries/user/useSignupMutation';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useSignupStore } from '@/stores/useSignupStore';
import { useToastStore } from '@/stores/useToastStore';
import { handleAuthApiError } from '@/utils/authApiError';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';

interface FormValues {
  image: File;
  nickname: string;
  session: string[];
  genre: string[];
}

export default function SignupStep2Page() {
  const router = useRouter();
  const { email, name, password, resetSignupData } = useSignupStore();
  const [missingInfoModalOpen, setMissingInfoModalOpen] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string>('');
  const { mutateAsync: signup } = useSignupMutation();
  const { handleImageUpload } = useImageUpload();

  const hasCheckedRef = useRef(false);

  useEffect(() => {
    if (hasCheckedRef.current) return;
    hasCheckedRef.current = true;
    if (!email || !name || !password) {
      setMissingInfoModalOpen(true);
    }
  }, [email, name, password, router]);

  const methods = useForm<FormValues>({
    mode: 'all',
    defaultValues: { image: undefined, nickname: '', session: [], genre: [] },
    shouldUnregister: false,
  });

  const {
    formState: { isValid },
    setValue,
    control,
  } = methods;

  const handleFileUpload = async (file: File) => {
    const uploadedUrl = await handleImageUpload(1, file);
    if (uploadedUrl) {
      setProfileImageUrl(uploadedUrl);
    }
  };

  const handleSessionTagChange = (selected: string[]) => {
    setValue('session', selected);
  };
  const handleGenreTagChange = (selected: string[]) => {
    setValue('genre', selected);
  };

  const tagSections = [
    {
      key: 'session',
      label: '담당 세션',
      tags: SESSION_TAGS,
      initialSelected: [],
      onChange: handleSessionTagChange,
    },
    {
      key: 'genre',
      label: '선호 장르',
      tags: GENRE_TAGS,
      initialSelected: [],
      onChange: handleGenreTagChange,
    },
  ];

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!email || !name || !password) {
      setMissingInfoModalOpen(true);
      return;
    }

    const preferredGenres = data.genre.map((kr) => GENRE_KR_TO_ENUM[kr]);
    const preferredBandSessions = data.session.map(
      (kr) => SESSION_KR_TO_ENUM[kr],
    );
    try {
      const profileImagePath = profileImageUrl;
      const fullData = {
        email,
        username: data.nickname,
        password,
        nickname: data.nickname,
        preferredGenres,
        preferredBandSessions,
        profileImagePath,
      };

      await signup(fullData);
      useToastStore.getState().show('회원가입이 완료되었습니다!');
      router.push('/login');

      resetSignupData();
    } catch (error) {
      handleAuthApiError(error, '회원가입에 실패했습니다.');
    }
  };

  return (
    <>
      <AuthCard title="프로필 만들기">
        <div className="tab:w-[25.125rem] flex w-[19.4375rem] flex-col items-center">
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              noValidate
              className="flex w-full flex-col gap-[1.5rem]"
            >
              <div className="mx-auto">
                <Controller
                  name="image"
                  control={control}
                  render={({ field }) => (
                    <ProfileImageUpload
                      imageFile={profileImageUrl}
                      onFileChange={(file) => {
                        field.onChange(file);
                        handleFileUpload(file);
                      }}
                      profileSize={128}
                      editIconSize={41}
                      offsetX={80}
                      offsetY={40}
                    />
                  )}
                />
              </div>

              <Input
                name="nickname"
                type="text"
                label="닉네임"
                placeholder="닉네임을 입력해주세요."
                rules={{
                  required: '닉네임은 필수 입력입니다.',
                }}
              />

              <div className="flex flex-col gap-4">
                {tagSections.map(
                  ({ key, label, tags, initialSelected, onChange }) => (
                    <TagSection
                      key={key}
                      label={label}
                      tags={tags}
                      initialSelected={initialSelected}
                      onChange={onChange}
                    />
                  ),
                )}
              </div>

              <Button
                variant="solid"
                size="large"
                className="w-full"
                type="submit"
                disabled={!isValid}
              >
                완료
              </Button>
            </form>
          </FormProvider>
        </div>
      </AuthCard>
      {missingInfoModalOpen && (
        <ModalInteraction
          message={`이전 단계 정보를 확인할 수 없어\n다시 입력이 필요합니다.`}
          onClose={() => {
            setMissingInfoModalOpen(false);
            router.replace('/signup/step1');
          }}
          onConfirm={() => {
            setMissingInfoModalOpen(false);
            router.replace('/signup/step1');
          }}
          isShowCancel={false}
        />
      )}
    </>
  );
}
