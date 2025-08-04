'use client';

import { useEffect, useState } from 'react';
import CardItem from '@/components/commons/Card/CardItem';
import { CARD_STATE } from '@/constants/card';
import { mockRecruits } from '@/constants/checkbox';
import { GatheringCard } from '@/types/card';

const LIMIT = 20;

export default function NoVirtualPage() {
  const [page, setPage] = useState(0);
  const [list, setList] = useState<GatheringCard[]>([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const start = page * LIMIT;
    const end = start + LIMIT;
    const newItems = mockRecruits.slice(start, end);
    setList((prev) => [...prev, ...newItems]);
    if (end >= mockRecruits.length) setHasMore(false);
  }, [page]);

  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
      {list.map((item, index) => (
        <CardItem
          key={item.id}
          item={item}
          status={CARD_STATE.PROGRESS}
          isFirst={index === 0}
        />
      ))}
      {hasMore && (
        <div
          className="h-10 w-full"
          ref={(el) => {
            if (!el) return;
            const observer = new IntersectionObserver(
              (entries) => {
                if (entries[0].isIntersecting) {
                  setPage((p) => p + 1);
                }
              },
              { threshold: 0.5 },
            );
            observer.observe(el);
          }}
        />
      )}
    </div>
  );
}
