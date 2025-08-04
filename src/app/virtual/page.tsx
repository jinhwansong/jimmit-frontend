'use client';

import CardItem from '@/components/commons/Card/CardItem';
import InfinityScroll from '@/components/commons/InfinityScroll';
import { CARD_STATE } from '@/constants/card';
import { mockRecruits } from '@/constants/checkbox';
import { GatheringCard } from '@/types/card';
import { useEffect, useState } from 'react';

const LIMIT = 20;

export default function VirtualPage() {
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
    <InfinityScroll
      list={list}
      item={(item, index) => (
        <CardItem
          item={item}
          status={CARD_STATE.PROGRESS}
          isFirst={index === 0}
        />
      )}
      emptyText="아직 데이터가 없습니다."
      onInView={() => setPage((p) => p + 1)}
      hasMore={hasMore}
      variant="grid"
    />
  );
}
