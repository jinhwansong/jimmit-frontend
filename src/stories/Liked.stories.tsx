import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Liked from '@/components/commons/Liked';

const meta: Meta<typeof Liked> = {
  title: 'Components/Like',
  component: Liked,
  decorators: [
    (Story) => (
      <div
        style={{
          padding: '2rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    isLiked: {
      control: { type: 'boolean' },
      description: '좋아요 상태',
    },
    onClick: {
      action: 'clicked',
      description: '클릭 이벤트 핸들러',
    },
    className: {
      control: { type: 'text' },
      description: '추가 CSS 클래스, 대부분 아이콘이 들어',
    },
    children: {
      control: { type: 'text' },
      description: '버튼 내부 콘텐츠',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Liked>;

export const Default: Story = {
  args: {
    isLiked: false,
    onClick: () => console.log('Like clicked'),
    children: '❤️',
  },
};
