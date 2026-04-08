'use client';

import ModalEdit from '@/components/commons/Modal/ModalEdit';
import { useState } from 'react';

import { useUpdateProfile } from '@/hooks/queries/user/useUpdateProfile';
import { useUpdateProfileImage } from '@/hooks/queries/user/useUpdateProfileImage';
import { useUserMeQuery } from '@/hooks/queries/user/useUserMeQuery';
import { useUserStore } from '@/stores/useUserStore';
import { EditFormData } from '@/types/modal';
import { handleAuthApiError } from '@/utils/authApiError';
import SkeletonUserCard from './SkeletonUserCard';
import UserCardItem from './UserCardItem';

export default function UserCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const updateProfile = useUpdateProfile();
  const updateProfileImage = useUpdateProfileImage();
  const { user: initialUser, isLoaded, isRefreshing, setUser } = useUserStore();
  const isUserMeQueryReady = isLoaded && !isRefreshing && !!initialUser;

  const { data: user, isLoading } = useUserMeQuery({
    enabled: isUserMeQueryReady,
  });

  const isQueryReady = isLoaded && !isRefreshing && !!user;

  if (isLoading || !isQueryReady) {
    return <SkeletonUserCard />;
  }

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = async (data: EditFormData) => {
    try {
      const imageUrl =
        typeof data.image === 'string' ? data.image : user.profileImagePath;
      // 프로필 업데이트
      await updateProfile.mutateAsync(data);

      // 이미지 업데이트
      if (imageUrl !== user.profileImagePath) {
        await updateProfileImage.mutateAsync({
          orgFileName: 'profile.jpg',
          profileImagePath: imageUrl,
        });
      }

      const updatedUser = {
        ...user,
        username: data.username,
        preferredGenres: data.preferredGenres,
        preferredBandSessions: data.preferredBandSessions,
      };
      setUser(updatedUser);
      setIsModalOpen(false);
    } catch (error) {
      handleAuthApiError(error, '프로필 수정에 실패했습니다.');
    }
  };

  return (
    <>
      <UserCardItem user={user} setIsModalOpen={setIsModalOpen} />
      {isModalOpen && (
        <ModalEdit
          onCancel={handleModalCancel}
          onSubmit={handleModalSubmit}
          initialData={{
            email: user.email,
            password: null,
            username: user.username,
            image: user.profileImagePath,
            preferredBandSessions: user.preferredBandSessions,
            preferredGenres: user.preferredGenres,
          }}
          userId={user.id}
        />
      )}
    </>
  );
}
