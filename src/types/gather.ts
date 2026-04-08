import { GatheringCard } from '@/types/card';
import { GatheringDetailResponse } from '@/types/gathering';
import { GenreType, BandSessionType, GatheringStatus } from './tags';

export interface GatheringsResponse {
  gatherings: GatheringCard[];
  currentPage: number;
  totalPage: number;
  totalElements: number;
}

export interface GetUserGatheringsParams {
  page: number;
  size: number;
  includeCanceled?: boolean;
  enabled?: boolean;
}
export interface RegisterGatheringsRequest {
  name: string;
  thumbnail: string;
  place: string;
  description: string;
  gatheringDateTime: string;
  recruitDateTime: string;
  genres: GenreType[];
  status: GatheringStatus;
  totalRecruitCount: number;
  gatheringSessions: {
    bandSession: BandSessionType;
    recruitCount: number;
  }[];
}

export type RegisterGatheringsResponse = GatheringDetailResponse & {
  message?: string;
};

export interface ModifiedGatheringsRequest {
  name: string;
  thumbnail: string;
  place: string;
  gatheringDateTime: string;
  totalRecruitCount: number;
  recruitDeadline: string;
  genres: GenreType[];
  description: string;
  gatheringSessions: {
    bandSession: BandSessionType;
    recruitCount: number;
  }[];
}

export interface ModifiedGatheringsResponse {
  id: number;
  name: string;
  thumbnail: string;
  place: string;
  description: string;
  gatheringDateTime: string;
  recruitDeadline: string;
  status: GatheringStatus;
  genres: GenreType[];
  sessions: {
    bandSession: BandSessionType;
    recruitCount: number;
    currentCount: number;
  }[];
  creator: {
    id: number;
    nickname: string;
  };
}
