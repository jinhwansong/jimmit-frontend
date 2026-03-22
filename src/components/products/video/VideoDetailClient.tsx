'use client';
import IcLove from '@/assets/icons/ic_love.svg';
import IcShare from '@/assets/icons/ic_share.svg';
import Button from '@/components/commons/Button';
import GoGether from '@/components/commons/GoGether';
import InfinityScroll from '@/components/commons/InfinityScroll';
import Liked from '@/components/commons/Liked';
import ProfileImage from '@/components/commons/ProfileImage';
import Textarea from '@/components/commons/Textarea';
import {
  useCommentMutation,
  useCommentQuery,
  useLikeMutation,
  useLikeStatus,
  useVideoDetailQuery,
} from '@/hooks/queries/video/useVideoDetail';
import { useDeviceType } from '@/hooks/useDeviceType';
import { CommentRequest } from '@/types/video';
import { formatDateToYYMMDD } from '@/utils/formatDate';
import { useSentryErrorLogger } from '@/utils/useSentryErrorLogger';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const MuxPlayer = dynamic(
  () => import('@mux/mux-player-react').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-video w-full animate-pulse bg-[#2d2d2d]" />
    ),
  },
);
import { FormProvider, useForm } from 'react-hook-form';
import VideoDetailSkeleton from './VideoDetailSkeleton';

const ShareLinkModal = dynamic(() => import('../group/ShareLinkModal'), {
  ssr: false,
});

interface prop {
  videoId: string;
}

export default function VideoDetailClient({ videoId }: prop) {
  const deviceType = useDeviceType();
  const [open, setOpen] = useState(false);
  const { data, isLoading, isError, error } = useVideoDetailQuery({ videoId });
  const {
    data: comment,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isError: isCommentError,
    error: commentError,
  } = useCommentQuery({ take: 10, videoId });
  const {
    data: likeStatus,
    isLoading: likeStatusLoading,
    isError: isLikeError,
    error: likeError,
  } = useLikeStatus({
    videoId,
  });
  const { mutate: submitComment } = useCommentMutation(videoId);

  const { mutate: toggleLike } = useLikeMutation();

  const flatData = comment?.pages.flatMap((item) => item.data);
  const isInitialLoading = !data && isFetching;

  const getProfileSize = () => {
    switch (deviceType) {
      case 'pc':
        return 3;
      case 'tab':
        return 2;
      case 'mob':
        return 2;
      default:
        return 3;
    }
  };
  const methods = useForm<CommentRequest>({
    defaultValues: {
      content: '',
    },
    mode: 'onChange',
  });

  const { handleSubmit, watch } = methods;
  const commentValue = watch('content');
  const onSubmit = (data: CommentRequest) => {
    submitComment(data.content);
    methods.reset();
  };
  // 자동 Sentry 로깅
  useSentryErrorLogger({
    isError,
    error,
    tags: { section: 'video', action: 'detail' },
    message: '비디오 상세 정보 불러오기 실패',
  });

  useSentryErrorLogger({
    isError: isCommentError,
    error: commentError,
    tags: { section: 'video', action: 'comment' },
    message: '댓글 불러오기 실패',
  });

  useSentryErrorLogger({
    isError: isLikeError,
    error: likeError,
    tags: { section: 'video', action: 'likeStatus' },
    message: '좋아요 상태 불러오기 실패',
  });
  if (isLoading || likeStatusLoading) return <VideoDetailSkeleton />;
  return (
    <div className="pc:max-w-[84rem] pc:mt-6 pc:mb-36 tab:mb-11 mx-auto mb-6">
      <MuxPlayer
        playbackId={data?.playbackId}
        metadata={{
          video_id: videoId,
          video_title: data?.title,
          viewer_user_id: data?.nickname,
        }}
        className="mux-player"
        style={{ width: '100%', height: 'auto' }}
      />
      <div className="pc:mt-6 tab:mt-8 pc:mx-0 tab:mx-8 mx-4 mt-4">
        <div className="pc:flex tab:flex block items-start justify-between">
          <div>
            <em className="block flex-[1] truncate pr-4 text-2xl leading-none font-bold">
              {data?.title}
            </em>
            <span className="mt-4 mb-3.5 block leading-none opacity-60">
              {data?.nickname}
            </span>
            <p className="leading-none opacity-60">
              조회수 {data?.viewCount ?? 0}회
              <span className="mx-2 inline-flex">|</span>
              {formatDateToYYMMDD(data?.createdAt as string)}
            </p>
          </div>
          <div className="pc:mt-0 tab:mt-0 mt-8 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Liked
                isLiked={likeStatus?.liked as boolean}
                onClick={() => toggleLike({ videoId })}
              >
                <IcLove
                  className={
                    likeStatus?.liked
                      ? 'text-[var(--primary)]'
                      : 'text-[#6b7280]'
                  }
                />
              </Liked>
              <p
                className={
                  likeStatus && likeStatus?.liked
                    ? 'text-[var(--primary)]'
                    : 'opacity-60'
                }
              >
                {likeStatus?.likeCount}
              </p>
            </div>
            <button onClick={() => setOpen(true)}>
              <IcShare />
            </button>
          </div>
        </div>
        <p className="pc:my-10 my-8 leading-[160%]">{data?.description}</p>
        {data?.slug && (
          <div className="pc:my-10 my-8">
            <GoGether
              gatheringId={Number(data?.slug)}
              gatheringName={data?.creatorTitle as string}
              gatheringHostNickname={data?.creatorName as string}
              gatheringThumbnail={data?.creatorThumbnailUrl as string}
            />
          </div>
        )}

        <div className="flex items-center">
          <em className="text-[1.25rem]">댓글</em>
          <span className="mr-5 ml-2 block text-[1.25rem] text-[var(--purple-500)]">
            {comment?.pages[0].totalCount}
          </span>
          <div className="h-[1px] flex-[1] bg-[#9ca3af]" />
        </div>

        <div className="border-b border-b-[#9ca3af]">
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="pc:gap-9 tab:gap-6 pc:my-8 pc:items-start flex flex-wrap items-center justify-end gap-3 py-5"
            >
              <Textarea
                classnames="pc:flex-[1] tab:flex-[1] w-full max-h-[5.75rem] box-sizing "
                placeholder="댓글을 입력해주세요."
                name="content"
                autoResize
                rules={{
                  required: '댓글을 입력하세요.',
                  maxLength: {
                    value: 300,
                    message: '댓글은 300자 이내로 입력해주세요.',
                  },
                }}
              />
              <Button
                size="middle"
                variant="outlineOrder"
                type="submit"
                disabled={!commentValue?.trim() || commentValue.length > 300}
                aria-label="댓글 저장 버튼"
              >
                등록
              </Button>
            </form>
          </FormProvider>
          <InfinityScroll
            isInitialLoading={isInitialLoading}
            list={flatData}
            variant="comment"
            item={(item) => (
              <div
                key={item.id}
                className="pc:py-8 pc:flex items-center gap-12 border-t border-t-[#2d3035] py-5"
              >
                <div className="pc:gap-12 flex items-center gap-4">
                  <ProfileImage
                    src={item.profileImagePath}
                    size={getProfileSize()}
                  />
                  <span className="font-bold">{item.nickname}</span>
                </div>
                <p className="pc:mt-0 mt-5 leading-[160%]">{item.content}</p>
              </div>
            )}
            emptyText="댓글이 존재 하지 않습니다."
            hasMore={!!hasNextPage && !isFetching}
            onInView={() => {
              if (hasNextPage && !isFetching) {
                fetchNextPage();
              }
            }}
          />
        </div>
      </div>
      {open && videoId && (
        <ShareLinkModal
          inviteLink={`https://www.jimmit.store/video/${videoId}`}
          onClose={() => setOpen(false)}
          text="내가 올린 영상을"
        />
      )}
    </div>
  );
}
