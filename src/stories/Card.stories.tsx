import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Image from 'next/image';

// SVG 대신 span을 사용하는 컴포넌트들
interface ThumbnailProps {
  thumbnail: string;
  alt: string;
  isFirst: boolean;
}

function Thumbnail({ thumbnail, alt, isFirst }: ThumbnailProps) {
  return (
    <Image
      src={thumbnail}
      alt={alt}
      width={343}
      height={200}
      loading={isFirst ? 'eager' : 'lazy'}
      priority={isFirst}
      className="h-full w-full object-cover"
    />
  );
}

interface TagListProps {
  tags: string[];
}

function TagList({ tags }: TagListProps) {
  return (
    <div className="mt-[1.25rem] flex flex-wrap gap-[0.375rem]">
      {tags.slice(0, 3).map((tag) => (
        <span
          key={tag}
          className="rounded-lg bg-[var(--bg-34343A)] px-3 py-1.5 text-sm font-medium"
        >
          {tag}
        </span>
      ))}
      {tags.length > 3 && (
        <span className="rounded-lg bg-[var(--bg-34343A)] px-3 py-1.5 text-sm font-medium">
          ...
        </span>
      )}
    </div>
  );
}

interface TitleBlockProps {
  title: string;
  author: string;
}

function TitleBlock({ title, author }: TitleBlockProps) {
  return (
    <>
      <div className="mt-5 truncate text-lg leading-none font-semibold">
        {title}
      </div>
      <div className="mt-5 leading-none text-gray-300">{author}</div>
    </>
  );
}

interface FooterProps {
  status: string;
  totalCurrent: number;
  totalRecruit: number;
  recruitDeadline?: string;
  member?: {
    bandSession: string;
    recruitCount: number;
    currentCount: number;
  }[];
}

function Footer({
  status,
  totalCurrent,
  totalRecruit,
  recruitDeadline,
  member,
}: FooterProps) {
  const text = `${totalCurrent}/${totalRecruit}`;

  const right = () => {
    switch (status) {
      case '모집중':
        return (
          <div className="group relative">
            <span className="text-[var(--primary)]">{text}</span> 명 모집중
            {member && member.length > 0 && (
              <ul className="absolute right-[0px] bottom-[2.125rem] hidden rounded-lg bg-[var(--gray-100)] group-hover:block">
                {member.map((item) => (
                  <li
                    key={item.bandSession}
                    className="flex w-[8.875rem] items-center border-b border-b-[#3B3B40] px-4 py-2.5 last:border-none"
                  >
                    <p className="w-3/5">{item.bandSession}</p>
                    <span className="w-2/5">
                      {item.currentCount}/{item.recruitCount}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      case '신청완료':
        return (
          <p className="rounded-lg border border-[var(--purple-500)] bg-[var(--bg-34343A)] px-3 py-1.5 text-sm font-medium text-[var(--purple-500)]">
            신청완료
          </p>
        );
      case '합주확정':
        return (
          <p className="flex items-center gap-1 rounded-lg border border-[var(--purple-500)] bg-[var(--bg-34343A)] px-3 py-1.5 text-sm font-medium text-white">
            <span>✓</span>
            합주확정
          </p>
        );
      case '합주취소':
        return (
          <p className="rounded-lg bg-[var(--bg-34343A)] px-3 py-1.5 text-sm font-medium text-[var(--gray-400)]">
            합주취소
          </p>
        );
      case '합주완료':
        return (
          <p className="rounded-lg bg-[var(--bg-34343A)] px-3 py-1.5 text-sm font-medium text-[var(--gray-400)]">
            합주완료
          </p>
        );
      default:
        return null;
    }
  };

  const left = () => {
    if (status === '모집중') {
      return (
        <span className="pc:block hidden">
          {recruitDeadline
            ? new Date(recruitDeadline).toLocaleDateString()
            : '마감일 미정'}
        </span>
      );
    }
    return (
      <div>
        <span className="text-[var(--primary)]">{text}</span> 명
      </div>
    );
  };

  return (
    <div className="mt-5 border-t border-t-[#393940] pt-[1.37rem]">
      <div className="flex items-center justify-between">
        {left()} {right()}
      </div>
    </div>
  );
}

interface LikeProps {
  isLiked: boolean;
  onClick: () => void;
}

function Like({ isLiked, onClick }: LikeProps) {
  return (
    <button
      onClick={onClick}
      className="absolute top-2 right-2 z-10"
      aria-label={isLiked ? '좋아요 취소' : '좋아요'}
    >
      <span
        className={`text-2xl ${isLiked ? 'text-[var(--primary)]' : 'text-white'}`}
      >
        {isLiked ? '❤️' : '🤍'}
      </span>
    </button>
  );
}

// CardItem 컴포넌트
interface CardItemProps {
  item: {
    id: number;
    name: string;
    thumbnail: string;
    genres: string[];
    creator: {
      nickname: string;
    };
    totalCurrent: number;
    totalRecruit: number;
    recruitDeadline?: string;
    sessions: {
      bandSession: string;
      recruitCount: number;
      currentCount: number;
    }[];
  };
  isLike?: boolean;
  status: string;
  isFirst?: boolean;
}

function CardItem({
  item,
  isLike = false,
  status,
  isFirst = false,
}: CardItemProps) {
  return (
    <div className="w-full max-w-sm">
      <div className="pc:aspect-[8/5] tab:aspect-[87/25] relative aspect-[343/200] overflow-hidden rounded-lg">
        {isLike && (
          <Like isLiked={true} onClick={() => console.log('Like clicked')} />
        )}
        <Thumbnail
          thumbnail={item.thumbnail}
          alt={item.name}
          isFirst={isFirst}
        />
      </div>

      <TagList tags={item.genres} />
      <TitleBlock title={item.name} author={item.creator.nickname} />
      <Footer
        status={status}
        totalCurrent={item.totalCurrent}
        totalRecruit={item.totalRecruit}
        recruitDeadline={item.recruitDeadline}
        member={item.sessions}
      />
    </div>
  );
}

// 샘플 데이터 - 실제 이미지 URL 사용
const sampleCardData = {
  id: 1,
  name: '재즈 밴드 모집',
  thumbnail:
    'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=343&h=200&fit=crop&crop=center',
  genres: ['재즈', '퓨전', '스윙'],
  creator: {
    nickname: '재즈마스터',
  },
  totalCurrent: 3,
  totalRecruit: 5,
  recruitDeadline: '2024-12-31',
  sessions: [
    { bandSession: '드럼', recruitCount: 1, currentCount: 1 },
    { bandSession: '베이스', recruitCount: 1, currentCount: 1 },
    { bandSession: '피아노', recruitCount: 1, currentCount: 0 },
    { bandSession: '색소폰', recruitCount: 1, currentCount: 1 },
    { bandSession: '트럼펫', recruitCount: 1, currentCount: 0 },
  ],
};

const meta: Meta<typeof CardItem> = {
  title: 'Components/Card/CardItem',
  component: CardItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isLike: {
      control: { type: 'boolean' },
      description: '좋아요 표시 여부',
    },
    status: {
      control: { type: 'select' },
      options: ['모집중', '신청완료', '합주확정', '합주취소', '합주완료'],
      description: '카드 상태',
    },
    isFirst: {
      control: { type: 'boolean' },
      description: '첫 번째 카드 여부',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CardItem>;

export const RecruitingCard: Story = {
  args: {
    item: sampleCardData,
    status: '모집중',
    isLike: false,
    isFirst: false,
  },
};

export const LikedCard: Story = {
  args: {
    item: sampleCardData,
    status: '모집중',
    isLike: true,
    isFirst: false,
  },
};

export const AppliedCard: Story = {
  args: {
    item: {
      ...sampleCardData,
      name: '락 밴드 모집',
      thumbnail:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=343&h=200&fit=crop&crop=center',
      genres: ['락', '하드락', '메탈'],
      creator: { nickname: '락스타' },
    },
    status: '신청완료',
    isLike: false,
    isFirst: false,
  },
};

export const ConfirmedCard: Story = {
  args: {
    item: {
      ...sampleCardData,
      name: '팝 밴드 모집',
      thumbnail:
        'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=343&h=200&fit=crop&crop=center',
      genres: ['팝', '팝락', '인디'],
      creator: { nickname: '팝스타' },
    },
    status: '합주확정',
    isLike: true,
    isFirst: false,
  },
};

export const CancelledCard: Story = {
  args: {
    item: {
      ...sampleCardData,
      name: '클래식 밴드 모집',
      thumbnail:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=343&h=200&fit=crop&crop=center&sat=-50',
      genres: ['클래식', '오케스트라'],
      creator: { nickname: '클래식마스터' },
    },
    status: '합주취소',
    isLike: false,
    isFirst: false,
  },
};

export const CompletedCard: Story = {
  args: {
    item: {
      ...sampleCardData,
      name: '블루스 밴드 모집',
      thumbnail:
        'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=343&h=200&fit=crop&crop=center&sat=50',
      genres: ['블루스', 'R&B', '소울'],
      creator: { nickname: '블루스킹' },
    },
    status: '합주완료',
    isLike: true,
    isFirst: false,
  },
};

export const FirstCard: Story = {
  args: {
    item: {
      ...sampleCardData,
      name: '첫 번째 카드',
      thumbnail:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=343&h=200&fit=crop&crop=center&brightness=50',
      genres: ['첫번째', '특별한', '카드'],
      creator: { nickname: '첫번째작성자' },
    },
    status: '모집중',
    isLike: false,
    isFirst: true,
  },
};
