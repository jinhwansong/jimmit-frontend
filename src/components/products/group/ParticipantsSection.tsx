'use client';

import Button from '@/components/commons/Button';
import ModalReview from '@/components/commons/Modal/ModalReview';
import ProfileImage from '@/components/commons/ProfileImage';
import { ReviewField, tagToFieldMap } from '@/constants/review';
import { SESSION_ENUM_TO_KR } from '@/constants/tagsMapping';
import { usePostReviewMutation } from '@/hooks/queries/review/usePostReviewMutation';
import { useToastStore } from '@/stores/useToastStore';
import { useUserStore } from '@/stores/useUserStore';
import { GatheringDetailResponse, Participant } from '@/types/gathering';
import { ReviewItem } from '@/types/review';
import { handleAuthApiError } from '@/utils/authApiError';
import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';

interface ParticipantsSectionProps {
  gathering: GatheringDetailResponse;
  participants: Participant[];
  writtenReviews: ReviewItem[] | undefined;
}

export default function ParticipantsSection({
  gathering,
  participants,
  writtenReviews,
}: ParticipantsSectionProps) {
  const user = useUserStore((state) => state.user);
  const isHost = user?.id === gathering.creator.id;

  const isParticipating = participants.some(
    (participant) => participant.userId === user?.id,
  );

  const isCompleted = gathering.status === 'COMPLETED';
  const [selectedParticipant, setSelectedParticipant] = useState<{
    userId: number;
    nickname: string;
  } | null>(null);
  const reviewMutation = usePostReviewMutation();

  const participantsWithHost: Participant[] = [
    {
      participantId: -1, // 임의의 숫자
      userId: gathering.creator.id,
      userNickname: gathering.creator.nickname,
      userEmail: 'host@example.com', // 임의 이메일
      bandSession: 'VOCAL', // 임의 세션
      status: 'COMPLETED',
      createdAt: new Date().toISOString(), // 임의 시간 (현재 시간)
      introduction: '',
      userProfileImagePath: gathering.creator.profileImagePath,
    },
    ...participants,
  ];

  const handleOpenReviewModal = (userId: number, nickname: string) => {
    setSelectedParticipant({ userId, nickname });
  };

  const handleCloseReviewModal = () => {
    setSelectedParticipant(null);
  };

  const handleSubmitReview = (formData: { review: string; tags: string[] }) => {
    if (!selectedParticipant) return;

    const tagFields = Object.entries(tagToFieldMap).reduce(
      (acc, [tag, field]) => {
        acc[field] = formData.tags.includes(tag);
        return acc;
      },
      {} as Record<ReviewField, boolean>,
    );

    const reviewData = {
      revieweeId: selectedParticipant.userId,
      gatheringId: gathering.id,
      content: formData.review,
      ...tagFields,
    };

    reviewMutation.mutate(reviewData, {
      onSuccess: () => {
        handleCloseReviewModal();
        useToastStore.getState().show('리뷰가 성공적으로 작성되었습니다.');
      },
      onError: (error) => {
        handleAuthApiError(error, '리뷰 작성 중 오류가 발생했습니다.');
      },
    });
    handleCloseReviewModal();
  };

  return (
    <section className="pc:w-[60rem] tab:p-[2.5rem] w-full rounded-[0.5rem] bg-[#202024] p-[1.25rem]">
      <div className="flex flex-col justify-between gap-[0.625rem]">
        <h1 className="group-info-title">{gathering.name}</h1>
        <p className="group-info-subtitle">{gathering.creator.nickname}</p>
      </div>

      <div className="group-info-divider-line" />
      {participantsWithHost.map(
        (
          {
            participantId,
            userNickname,
            bandSession,
            introduction,
            userId,
            userProfileImagePath,
          },
          index,
        ) => {
          const hasWrittenReview = writtenReviews?.some(
            (review) =>
              review.revieweeId === userId &&
              review.gatheringId === gathering.id,
          );
          const isHostItem = index === 0;

          return (
            <div key={participantId}>
              <div className="pc:flex-row pc:items-center my-[0.75rem] flex flex-col">
                <div className="tab:gap-[1.25rem] mr-[1.25rem] flex items-center gap-[0.75rem]">
                  <ProfileImage src={userProfileImagePath} size={3} />

                  <div className="pc:w-[8.6875rem] flex items-center">
                    <span className="text-[1rem] underline underline-offset-2">
                      {userNickname}
                    </span>
                    {isHostItem && (
                      <div className="ml-[0.4375rem] flex h-[1rem] w-[2.875rem] items-center justify-center rounded-[0.5313rem] bg-purple-700 text-center text-[0.75rem] font-semibold">
                        주최자
                      </div>
                    )}
                  </div>

                  <div className="pc:w-[10.4375rem] flex gap-[0.25rem]">
                    {!isHostItem && (
                      <div className="rounded-[0.5rem] bg-[#34343A] px-[0.75rem] py-[0.375rem] text-gray-100">
                        {SESSION_ENUM_TO_KR[bandSession]}
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className={clsx(
                    'pc:mt-0 mt-[0.75rem] flex items-center break-keep text-ellipsis whitespace-pre-line',
                    isCompleted ? 'pc:w-[20.375rem]' : 'pc:w-[29.375rem]',
                  )}
                >
                  {introduction}
                </div>

                {isCompleted &&
                  user?.id !== userId &&
                  (isParticipating || isHost) && (
                    <div className="pc:mt-0 mt-[0.75rem]">
                      {hasWrittenReview ? (
                        <Button
                          disabled
                          variant="outline"
                          className="pc:w-[124px] w-full"
                        >
                          리뷰 작성 완료
                        </Button>
                      ) : (
                        <Button
                          className="pc:w-[124px] w-full"
                          variant="outline"
                          onClick={() =>
                            handleOpenReviewModal(userId, userNickname)
                          }
                        >
                          리뷰 쓰기
                        </Button>
                      )}
                    </div>
                  )}
              </div>
              <div className="border-b-[0.0625rem] border-[#2D3035]" />
            </div>
          );
        },
      )}
      {participants.length === 0 && (
        <div className="mt-[2.5rem] flex w-full flex-col items-center justify-center">
          <Image
            src="/images/img_character01.png"
            alt="링크 공유 캐릭터 이미지"
            width={128}
            height={128}
          />
          <div className="h-[1.5rem] w-full pt-[0.5rem] text-center text-gray-400">
            아직 참여 멤버가 없어요~
          </div>
        </div>
      )}
      {selectedParticipant && (
        <ModalReview
          onCancel={handleCloseReviewModal}
          onSubmit={handleSubmitReview}
          revieweeNickname={selectedParticipant.nickname}
        />
      )}
    </section>
  );
}
