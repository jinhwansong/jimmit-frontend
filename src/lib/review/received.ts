import { ReviewResponse, ReviewStatusPros } from '@/types/review';
import { apiClient } from '@/utils/apiClient';

export const getStatus = async () => {
  return await apiClient.get<ReviewStatusPros>('/review/received/statistics');
};

export async function getReview({
  pageParam,
  size,
}: {
  pageParam: number;
  size: number;
}): Promise<ReviewResponse> {
  const params = new URLSearchParams();
  params.append('page', pageParam.toString());
  params.append('pageSize', size.toString());
  return await apiClient.get<ReviewResponse>(
    `/review/received?${params.toString()}`,
  );
}
