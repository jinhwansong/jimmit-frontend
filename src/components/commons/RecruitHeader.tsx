'use client';
import IcReload from '@/assets/icons/ic_reload.svg';
import IcSort from '@/assets/icons/ic_sort.svg';
import MultiSelectDropdown from '@/components/commons/MultiSelectDropdown';
import { GENRE_OPTIONS, SESSION_OPTIONS } from '@/constants/checkbox';
import { useDeviceType } from '@/hooks/useDeviceType';
import { BandSession, Genre } from '@/types/tags';
import Image from 'next/image';
import Link from 'next/link';
import React, { Fragment, useCallback, useEffect, useState } from 'react';

interface FilterHeaderProps {
  genres: Genre[];
  setGenres: React.Dispatch<React.SetStateAction<Genre[]>>;
  sessions: BandSession[];
  setSessions: React.Dispatch<React.SetStateAction<BandSession[]>>;
  setSort?: React.Dispatch<React.SetStateAction<string>>;
  page?: string;
  sort?: string;
  defaultSessions: BandSession[];
  defaultGenres: Genre[];
}

export default function RecruitHeader({
  genres,
  setGenres,
  sessions,
  setSessions,
  setSort,
  page = 'main',
  sort,
  defaultSessions,
  defaultGenres,
}: FilterHeaderProps) {
  // 반응형 이미지
  const [src, setSrc] = useState<string | null>(null);
  const device = useDeviceType();
  useEffect(() => {
    if (device === 'mob') setSrc('/images/main/img_main_banner_mob.avif');
    else if (device === 'tab') setSrc('/images/main/img_main_banner_tab.avif');
    else setSrc('/images/main/img_main_banner_pc.avif');
  }, [device]);
  const handleSort = () => {
    const nextSort =
      sort === 'recruitDeadline,asc'
        ? 'recruitDeadline,desc'
        : 'recruitDeadline,asc';
    setSort?.(nextSort);
  };
  const handleReset = useCallback(() => {
    setGenres(defaultGenres);
    setSessions(defaultSessions);
  }, [setSessions, setGenres, defaultSessions, defaultGenres]);
  const sortLabel = sort === 'recruitDeadline,asc' ? '마감임박' : '최신순';
  if (!src) return null;
  return (
    <Fragment>
      <div className="pc:aspect-[1344/250] tab:aspect-[186/49] relative aspect-[375/199] min-h-[200px] overflow-hidden rounded-lg">
        {(device === 'tab' || device === 'mob') && (
          <div className="tab:left-[3.75rem] tab:text-left absolute inset-0 z-5 flex flex-col justify-center text-center">
            <p className="tab:text-[1.25rem] tab:tracking-[-0.04em] text-base leading-[1.5rem] text-[#DAA3FF]">
              함께하면 더 재밌으니까, 재밋 🤘️️
            </p>
            <em className="tab:tracking-[-0.04em] tab:text-[2rem] tab:mt-3 mt-2 block text-[1.25rem] leading-[2rem] font-semibold">
              지금 모임에 참여해보세요!
            </em>
          </div>
        )}
        <Image
          src={src}
          alt="메인이미지"
          fill
          priority
          quality={85}
          fetchPriority="high"
          sizes="100vw"
        />
      </div>
      <div className="pc:px-0 tab:px-6 mt-8 mb-9 flex items-center justify-between px-4">
        <div className="pc:w-auto pc:justify-normal flex w-full justify-between gap-2">
          <div className="flex gap-2">
            <MultiSelectDropdown
              label="장르"
              options={GENRE_OPTIONS}
              selected={genres}
              onChange={setGenres}
            />
            <MultiSelectDropdown
              label="세션"
              options={SESSION_OPTIONS}
              selected={sessions}
              onChange={setSessions}
            />
          </div>
          <div className="flex gap-2">
            {page !== 'wish' && (
              <button
                onClick={handleSort}
                className="pc:h-10 pc:w-[6.875rem] pc:gap-1 pc:rounded-lg pc:text-sm flex h-9 w-9 items-center justify-center gap-0 rounded-xl bg-[var(--gray-100)] text-[0px]"
              >
                <IcSort />
                {sortLabel}
              </button>
            )}
            <button
              onClick={handleReset}
              className="pc:h-10 pc:w-[6.875rem] pc:gap-1 pc:rounded-lg pc:text-sm flex h-9 w-9 items-center justify-center gap-0 rounded-xl bg-[var(--gray-100)] text-[0px]"
            >
              <IcReload />
              필터 초기화
            </button>
          </div>
        </div>
        {page !== 'wish' && (
          <Link
            href="/jam"
            className="pc:static pc:w-[9.25rem] tab:w-[calc(100%-48px)] fixed bottom-[1.375rem] z-30 h-11 w-[calc(100%-32px)] rounded-lg bg-[var(--purple-700)] text-center leading-11 font-semibold text-white"
          >
            모임 만들기
          </Link>
        )}
      </div>
    </Fragment>
  );
}
