import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Dropdown from '@/components/commons/Dropdown';
import DropdownMenuList from '@/components/commons/DropdownMenuList';

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem', minHeight: '200px' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    menuOptions: {
      control: { type: 'object' },
      description: '드롭다운에 표시될 메뉴 옵션들',
    },
    onSelect: { action: 'selected' },
    singleIcon: { control: false },
    prefixIcon: { control: false },
    surfixIcon: { control: false },
    isProfile: {
      control: 'boolean',
      description: '프로필 모드로 렌더링 여부',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: '드롭다운의 크기 (드롭다운 리스트도 같은 크기로 표시됨)',
      table: {
        type: { summary: 'sm | md | lg' },
        defaultValue: { summary: 'lg' },
        description: {
          summary:
            'sm: 9rem 고정, md: 반응형 (PC: 26rem, Tab: 32.5rem, Mobile: 14rem), lg: 자동 조정',
        },
      },
    },
    placeholder: {
      control: 'text',
      description: '플레이스홀더 텍스트',
    },
    value: {
      control: 'text',
      description: '선택된 값',
    },
  },
  args: {
    menuOptions: ['Option 1', 'Option 2', 'Option 3'],
    placeholder: '옵션을 선택하세요',
  },
};

export default meta;

type Story = StoryObj<typeof Dropdown>;

// 기본 스토리 (기본 드롭다운)
export const Default: Story = {
  args: {
    menuOptions: ['Option 1', 'Option 2', 'Option 3'],
    onSelect: (value) => console.log('선택된 메뉴:', value),
  },
};

// 다양한 크기 스토리
export const SmallSize: Story = {
  args: {
    menuOptions: ['Small 1', 'Small 2', 'Small 3'],
    size: 'sm',
    placeholder: '작은 크기 (9rem)',
    onSelect: (value) => console.log('선택된 메뉴:', value),
  },
  parameters: {
    docs: {
      description: {
        story:
          '작은 크기 드롭다운 (9rem). 드롭다운 리스트도 같은 크기로 표시됩니다.',
      },
    },
  },
};

export const MediumSize: Story = {
  args: {
    menuOptions: ['Medium Option 1', 'Medium Option 2', 'Medium Option 3'],
    size: 'md',
    placeholder: '중간 크기 (PC: 26rem, Tab: 32.5rem, Mobile: 14rem)',
    onSelect: (value) => console.log('선택된 메뉴:', value),
  },
  parameters: {
    docs: {
      description: {
        story:
          '중간 크기 드롭다운. 반응형으로 PC에서는 26rem, 태블릿에서는 32.5rem, 모바일에서는 14rem으로 표시됩니다.',
      },
    },
  },
};

export const LargeSize: Story = {
  args: {
    menuOptions: ['Large Option 1', 'Large Option 2', 'Large Option 3'],
    size: 'lg',
    placeholder: '큰 크기 (자동 조정)',
    onSelect: (value) => console.log('선택된 메뉴:', value),
  },
  parameters: {
    docs: {
      description: {
        story: '큰 크기 드롭다운. 내용에 따라 자동으로 크기가 조정됩니다.',
      },
    },
  },
};

// 크기 비교를 위한 스토리
export const SizeComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <h3 style={{ marginBottom: '0.5rem', color: '#6B7280' }}>
          Small Size (9rem)
        </h3>
        <Dropdown
          menuOptions={['Option 1', 'Option 2', 'Option 3']}
          size="sm"
          placeholder="Small dropdown"
          onSelect={(value) => console.log('Small selected:', value)}
        />
      </div>
      <div>
        <h3 style={{ marginBottom: '0.5rem', color: '#6B7280' }}>
          Medium Size (반응형)
        </h3>
        <Dropdown
          menuOptions={[
            'Medium Option 1',
            'Medium Option 2',
            'Medium Option 3',
          ]}
          size="md"
          placeholder="Medium dropdown"
          onSelect={(value) => console.log('Medium selected:', value)}
        />
      </div>
      <div>
        <h3 style={{ marginBottom: '0.5rem', color: '#6B7280' }}>
          Large Size (자동 조정)
        </h3>
        <Dropdown
          menuOptions={['Large Option 1', 'Large Option 2', 'Large Option 3']}
          size="lg"
          placeholder="Large dropdown"
          onSelect={(value) => console.log('Large selected:', value)}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '세 가지 크기를 한 번에 비교해볼 수 있습니다. 각 크기별로 드롭다운 리스트의 너비도 다르게 표시됩니다.',
      },
    },
  },
};

// prefixIcon이 있을 때
export const WithPrefixIcon: Story = {
  args: {
    menuOptions: ['Apple', 'Banana', 'Cherry'],
    prefixIcon: (
      <span role="img" aria-label="prefix" style={{ fontSize: '16px' }}>
        🍎
      </span>
    ),
    placeholder: '과일을 선택하세요',
    onSelect: (value) => console.log('선택된 메뉴:', value),
  },
};

// surfixIcon이 있을 때
export const WithSurfixIcon: Story = {
  args: {
    menuOptions: ['Red', 'Green', 'Blue'],
    surfixIcon: (
      <span role="img" aria-label="surfix" style={{ fontSize: '16px' }}>
        🔽
      </span>
    ),
    placeholder: '색상을 선택하세요',
    onSelect: (value) => console.log('선택된 메뉴:', value),
  },
};

// 프로필 모드 - 다양한 크기
export const ProfileModeWithSize: Story = {
  render: () => (
    <div
      style={{
        padding: '2rem',
        minHeight: '200px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ marginBottom: '1rem', color: '#6B7280' }}>
          Small Profile
        </h3>
        <Dropdown
          menuOptions={['Profile', 'Settings', 'Logout']}
          singleIcon={
            <span role="img" aria-label="profile" style={{ fontSize: '20px' }}>
              👤
            </span>
          }
          isProfile={true}
          size="sm"
          onSelect={(value) => console.log('Small profile selected:', value)}
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ marginBottom: '1rem', color: '#6B7280' }}>
          Medium Profile
        </h3>
        <Dropdown
          menuOptions={['Profile', 'Settings', 'Logout']}
          singleIcon={
            <span role="img" aria-label="profile" style={{ fontSize: '24px' }}>
              👤
            </span>
          }
          isProfile={true}
          size="md"
          onSelect={(value) => console.log('Medium profile selected:', value)}
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ marginBottom: '1rem', color: '#6B7280' }}>
          Large Profile
        </h3>
        <Dropdown
          menuOptions={['Profile', 'Settings', 'Logout']}
          singleIcon={
            <span role="img" aria-label="profile" style={{ fontSize: '28px' }}>
              👤
            </span>
          }
          isProfile={true}
          size="lg"
          onSelect={(value) => console.log('Large profile selected:', value)}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '프로필 모드에서 다양한 크기를 비교해볼 수 있습니다. 각 크기별로 드롭다운 리스트의 너비가 다르게 표시됩니다.',
      },
    },
  },
};

// 미리 선택된 값이 있는 경우
export const WithPreselectedValue: Story = {
  args: {
    menuOptions: ['Option 1', 'Option 2', 'Option 3'],
    value: 'Option 2',
    placeholder: '미리 선택된 값',
    onSelect: (value) => console.log('선택된 메뉴:', value),
  },
};

// DropdownMenuList 전용 스토리들
type DropdownMenuListStory = StoryObj<typeof DropdownMenuList>;

export const DropdownMenuListDefault: DropdownMenuListStory = {
  args: {
    menuOptions: ['Option 1', 'Option 2', 'Option 3'],
    onSelect: (value) => console.log('선택된 메뉴:', value),
  },
};

export const DropdownMenuListSmall: DropdownMenuListStory = {
  args: {
    menuOptions: ['Small 1', 'Small 2', 'Small 3'],
    size: 'sm',
    onSelect: (value) => console.log('선택된 메뉴:', value),
  },
};

export const DropdownMenuListMedium: DropdownMenuListStory = {
  args: {
    menuOptions: ['Medium Option 1', 'Medium Option 2', 'Medium Option 3'],
    size: 'md',
    onSelect: (value) => console.log('선택된 메뉴:', value),
  },
};

export const DropdownMenuListLarge: DropdownMenuListStory = {
  args: {
    menuOptions: ['Large Option 1', 'Large Option 2', 'Large Option 3'],
    size: 'lg',
    onSelect: (value) => console.log('선택된 메뉴:', value),
  },
};
