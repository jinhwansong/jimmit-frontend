import { GatheringCard } from './card';
import { BandSession, Genre } from './tags';

export interface RecruitPageProps {
  defaultGenres: Genre[];
  defaultSessions: BandSession[];
  showShareModal?: boolean;
  shareGroupId?: string;
  defaultSort?: string;
}

export interface RecruitResponse {
  gatherings: GatheringCard[];
  currentPage: number;
  totalPage: number;
  totalElements: number;
}
