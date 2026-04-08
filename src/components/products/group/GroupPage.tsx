'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

import { SESSION_KR_TO_ENUM } from '@/constants/tagsMapping';

import { useCancelParticipateGatheringMutation } from '@/hooks/queries/gatherings/useCancelParticipateGathering';
import { useGatheringDetailQuery } from '@/hooks/queries/gatherings/useGatheringsDetailQuery';
import { useGatheringParticipantsQuery } from '@/hooks/queries/gatherings/useGatheringsParticipantsQuery';
import { useParticipateGatheringMutation } from '@/hooks/queries/gatherings/useParticipateGatheringsMutation';
import { useWrittenReviewsQuery } from '@/hooks/queries/review/useWrittenReviewsQuery';

import { useQueryTab } from '@/hooks/useQueryTab';
import { useUserStore } from '@/stores/useUserStore';
import { imgChange } from '@/utils/imgChange';

import GroupPageLayout from '@/components/commons/GroupPageLayout';
import ModalInteraction from '@/components/commons/Modal/ModalInteraction';
import GroupPageSkeleton from './GroupPageSkeleton';
import RenderActionButtons from './RenderActionButtons';
import GroupInfoSection from './GroupInfoSection';
import MemberInfoSection from './MemberInfoSection';
import ParticipantsSection from './ParticipantsSection';
import { GatheringDetailResponse } from '@/types/gathering';
import MemberTabSkeleton from './MemberTabSkeleton';

export default function GroupPage({
  id,
  initialData,
}: {
  id: number;
  initialData: GatheringDetailResponse;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupId = id;

  const { activeTab } = useQueryTab<'recruit' | 'members'>('tab', 'recruit', [
    'recruit',
    'members',
  ]);
  const { user, isLoaded, isRefreshing } = useUserStore();

  const [showParticipationForm, setShowParticipationForm] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    if (activeTab === 'members' && !user) {
      setLoginModalOpen(true);
    }
  }, [activeTab, user, router, searchParams, isLoaded]);

  const { data: gatheringDetailData, isLoading } = useGatheringDetailQuery(
    groupId,
    { initialData },
  );

  const isMembersTabQueryReady = isLoaded && !isRefreshing && !!user;

  const { data: participantsData, isLoading: isParticipantsLoading } =
    useGatheringParticipantsQuery(groupId, {
      enabled: isMembersTabQueryReady,
    });

  const { data: writtenReviewsData, isLoading: isWrittenReviewLoading } =
    useWrittenReviewsQuery({
      enabled: isMembersTabQueryReady,
    });

  const participateMutation = useParticipateGatheringMutation();
  const cancelMutation = useCancelParticipateGatheringMutation();

  if (isRefreshing) {
    return <MemberTabSkeleton />;
  }
  if (isLoading) {
    return <GroupPageSkeleton />;
  }
  if (!gatheringDetailData) return <div>모임 정보를 찾을 수 없습니다.</div>;

  if (activeTab === 'members') {
    if (!user) {
    } else {
      if (isParticipantsLoading || isWrittenReviewLoading)
        return <MemberTabSkeleton />;
    }
  }

  const isHost = user?.id === gatheringDetailData.creator.id;
  const isCompleted = gatheringDetailData.status === 'COMPLETED';
  const participants = participantsData?.participants ?? [];
  const myParticipant = participants.find(
    (participant) => participant.userId === user?.id,
  );
  const myParticipantId = myParticipant?.participantId;
  const approvedParticipants = participants.filter(
    (participant) => participant.status === 'APPROVED',
  );
  const pendingParticipants = participants.filter(
    (participant) => participant.status === 'PENDING',
  );
  const completedParticipants = participants.filter(
    (participant) => participant.status === 'COMPLETED',
  );
  const totalCurrentParticipants = gatheringDetailData.sessions.reduce(
    (sum, session) => sum + session.currentCount,
    0,
  );

  const handleCanceleParticipation = () => {
    if (!myParticipantId) {
      console.warn('참여 정보를 찾을 수 없습니다.');
      return;
    }
    cancelMutation.mutate({
      gatheringId: groupId,
      participantId: myParticipantId,
    });
  };

  const handleSubmitParticipation = ({
    session,
    introduction,
  }: {
    session: string;
    introduction: string;
  }) => {
    const sessionEnum = SESSION_KR_TO_ENUM[session];
    participateMutation.mutate({
      id: groupId,
      bandSession: sessionEnum,
      introduction,
    });
    setShowParticipationForm(false);
  };

  const handleLoginModalClose = () => {
    setLoginModalOpen(false);
    router.push('/login');
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('tab', 'recruit');
    router.replace(`?${newParams.toString()}`);
  };

  return (
    <>
      <GroupPageLayout
        participantsNumber={
          isCompleted
            ? totalCurrentParticipants + 1
            : totalCurrentParticipants + 1
        }
        banner={
          <div className="pc:rounded-[0.5rem] pc:h-[22rem] tab:h-[22rem] relative h-[14.5rem] w-full overflow-hidden">
            <Image
              src={imgChange(gatheringDetailData.thumbnail, 'banner')}
              alt="모임 배너"
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>
        }
        actionButtons={
          <RenderActionButtons
            gathering={gatheringDetailData}
            isHost={isHost}
            userId={user?.id ?? null}
            participants={participants}
            showParticipationForm={showParticipationForm}
            onCancel={handleCanceleParticipation}
            onJoin={() => setShowParticipationForm(true)}
            onSubmitParticipation={handleSubmitParticipation}
          />
        }
      >
        {activeTab === 'recruit' ? (
          <GroupInfoSection gathering={gatheringDetailData} isHost={isHost} />
        ) : isHost && !isCompleted ? (
          <MemberInfoSection
            gathering={gatheringDetailData}
            approvedParticipants={approvedParticipants}
            pendingParticipants={pendingParticipants}
          />
        ) : (
          <ParticipantsSection
            writtenReviews={writtenReviewsData}
            gathering={gatheringDetailData}
            participants={
              isCompleted ? completedParticipants : approvedParticipants
            }
          />
        )}
      </GroupPageLayout>
      {loginModalOpen && (
        <ModalInteraction
          message="로그인 후 이용 가능한 기능입니다."
          onConfirm={handleLoginModalClose}
          onClose={handleLoginModalClose}
          isShowCancel={false}
        />
      )}
    </>
  );
}
