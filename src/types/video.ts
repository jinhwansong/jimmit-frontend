export interface VideoDetailResponse {
  id: string;
  title: string;
  playbackId: string;
  viewCount: number;
  description: string;
  nickname: string;
  userId: string;
  thumbnailUrl: string;
  createdAt: string;
  creatorName: string;
  creatorThumbnailUrl: string;
  creatorTitle: string;
  slug: string;
}
export interface VideoItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  nickname: string;
  createdAt: string;
  viewCount: number;
  duration: string;
}

export interface VideoUploadItem extends VideoItem {
  message: string;
}

export interface WeekTopVideo {
  id: string;
}

export interface GetVideoListResponse {
  totalPage: number;
  page: number;
  data: VideoItem[];
  weekTopVideo: WeekTopVideo;
}

export interface LikeStatus {
  liked: boolean;
  likeCount: number;
}
export interface LikeResponse extends LikeStatus {
  message: string;
}
export interface ViewResponse {
  message: string;
  videoId: string;
  viewCount: number;
}

export interface CommentPromise {
  id: string;
  content: string;
  nickname: string;
  profileImagePath: string;
  createdAt: string;
}

interface Comment extends CommentPromise {
  userId: string;
}

export interface CommentResponse {
  totalCount: number;
  totalPages: number;
  page: number;
  data: Comment[];
  message: string;
}
export interface CommentRequest {
  content: string;
}

export interface CreateVideoRequest {
  videoFile: File;
  title: string;
  description: string;
  accessToken: string;
  slug: number;
  creatorTitle: string;
  creatorName: string;
  thumbnailUrl: string;
  onProgress: (progress: number) => void;
}

export interface GetUserVideoListResponse {
  page: number;
  totalPage: number;
  data: VideoItem[];
  message: string;
}

export interface GetUserVideoCountResponse {
  count: number;
  message: string;
}
export interface GetGetherItem {
  id: number;
  name: string;
  thumbnail: string;
  gatheringDateTime: string;
  place: string;
  totalRecruit: number;
  totalCurrent: number;
  status: string;
  hostNickname: string;
}
export interface GetGetherResponse {
  success: boolean;
  code: number;
  message: string;
  result: GetGetherItem[];
}
