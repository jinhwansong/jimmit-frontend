import IcListCheck from '@/assets/icons/ic_list_check.svg';
import { CardStatus } from '@/constants/card';
import { SESSION_ENUM_TO_KR } from '@/constants/tagsMapping';
import { deadline } from '@/utils/deadline';
import { getRecruitStatus } from '@/utils/getRecruitStatus';
import { useRouter } from 'next/navigation';
import React from 'react';

interface FooterProps {
  status: CardStatus;
  totalCurrent: number;
  totalRecruit: number;
  member?: {
    bandSession: string;
    recruitCount: number;
    currentCount: number;
  }[];
  recruitDeadline?: string;
  id?: number;
  page?: string;
}

export default function Footer({
  status,
  totalCurrent,
  totalRecruit,
  recruitDeadline,
  member,
  id,
  page,
}: FooterProps) {
  const text = `${totalCurrent}/${totalRecruit}`;
  const cardStatus = getRecruitStatus(
    recruitDeadline as string,
    totalCurrent,
    totalRecruit,
  );
  const router = useRouter();
  const handleButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    router.push(`/group/${id}?tab=members`);
  };

  const right = () => {
    switch (status) {
      case '모집중':
        return (
          <div className="group relative">
            <span className="text-[var(--primary)]">{text}</span> 명{' '}
            {cardStatus}
            <ul className="absolute right-[0px] bottom-[2.125rem] hidden rounded-lg bg-[var(--gray-100)] group-hover:block">
              {member &&
                member.map((item) => (
                  <li
                    key={item.bandSession}
                    className="flex w-[8.875rem] items-center border-b border-b-[#3B3B40] px-4 py-2.5 last:border-none"
                  >
                    <p className="w-3/5">
                      {SESSION_ENUM_TO_KR[item.bandSession]}
                    </p>
                    <span className="w-2/5">
                      {item.currentCount}/{item.recruitCount}
                    </span>
                  </li>
                ))}
            </ul>
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
            <IcListCheck />
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
          {deadline(recruitDeadline as string)}
        </span>
      );
    }
    return (
      <div>
        <span className="text-[var(--primary)]">{text}</span> 명 {cardStatus}
      </div>
    );
  };
  return (
    <div className="mt-5 border-t border-t-[#393940] pt-[1.37rem]">
      <div className="flex items-center justify-between">
        {left()} {right()}
      </div>
      {status === '합주완료' && page === 'towrite' && (
        <button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            handleButton(e);
          }}
          type="button"
          className="mt-5 h-[44px] w-full rounded-lg border border-[var(--purple-500)] bg-[#242429] text-center text-[var(--purple-500)]"
        >
          리뷰쓰기
        </button>
      )}
    </div>
  );
}
