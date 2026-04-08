import { RecruitResponse } from '@/types/recruit';
import { GatheringReviewInfo } from '@/types/review';
import { apiClient } from '@/utils/apiClient';

export async function getReviewWrite(): Promise<GatheringReviewInfo[]> {
  return await apiClient.get<GatheringReviewInfo[]>('/review/unwritten');
}

export async function getReviewWrites({
  pageParam,
  size,
  includeCanceled,
}: {
  pageParam: number;
  size: number;
  includeCanceled: boolean;
}): Promise<RecruitResponse> {
  const params = new URLSearchParams();
  params.append('includeCanceled', includeCanceled.toString());
  params.append('page', pageParam.toString());
  params.append('size', size.toString());
  return await apiClient.get<RecruitResponse>(
    `/gatherings/my/participations?${params.toString()}`,
  );
}
