import { CardStatus } from '@/constants/card';
import { GatheringCard } from '@/types/card';
import Link from 'next/link';
import { Card } from '.';
import Like from './Like';

interface CardItemProps {
  item: GatheringCard;
  isLike?: boolean;
  status: CardStatus;
  page?: string;
  isFirst: boolean;
}

export default function CardItem({
  item,
  isLike = false,
  status,
  page = 'read',
  isFirst = false,
}: CardItemProps) {
  return (
    <Link
      key={item.id}
      href={`/group/${item.id}?tab=recruit`}
      className="min-h-[396px]"
    >
      <div className="pc:aspect-[8/5] tab:aspect-[87/25] relative aspect-[343/200] overflow-hidden rounded-lg">
        {isLike && <Like item={item} />}
        <Card.Thumbnail
          thumbnail={item.thumbnail}
          alt={item.name}
          isFirst={isFirst}
        />
      </div>

      <Card.TagList tags={item.genres} />
      <Card.TitleBlock title={item.name} author={item.creator.nickname} />
      <Card.Footer
        status={status}
        totalCurrent={item.totalCurrent}
        totalRecruit={item.totalRecruit}
        recruitDeadline={item.recruitDeadline}
        member={item.sessions}
        id={item.id}
        page={page}
      />
    </Link>
  );
}
