import type { Meta, StoryObj } from '@storybook/react';
import Button from '@/components/commons/Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: '버튼',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['solid', 'outline', 'outlineOrder'],
    },
    size: {
      control: { type: 'select' },
      options: ['large', 'middle', 'small'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const SolidLarge: Story = {
  args: {
    variant: 'solid',
    size: 'large',
  },
};

export const SolidMiddle: Story = {
  args: {
    variant: 'solid',
    size: 'middle',
  },
};

export const SolidSmall: Story = {
  args: {
    variant: 'solid',
    size: 'small',
  },
};

export const OutlineLarge: Story = {
  args: {
    variant: 'outline',
    size: 'large',
  },
};

export const OutlineMiddle: Story = {
  args: {
    variant: 'outline',
    size: 'middle',
  },
};

export const OutlineSmall: Story = {
  args: {
    variant: 'outline',
    size: 'small',
  },
};

export const OutlineOrderLarge: Story = {
  args: {
    variant: 'outlineOrder',
    size: 'large',
  },
};

export const OutlineOrderMiddle: Story = {
  args: {
    variant: 'outlineOrder',
    size: 'middle',
  },
};

export const OutlineOrderSmall: Story = {
  args: {
    variant: 'outlineOrder',
    size: 'small',
  },
};

export const DisabledSolid: Story = {
  args: {
    variant: 'solid',
    size: 'large',
    disabled: true,
    children: '비활성',
  },
};

export const DisabledOutline: Story = {
  args: {
    variant: 'outline',
    size: 'large',
    disabled: true,
    children: '비활성',
  },
};

export const Interactive: Story = {
  args: {
    children: '인터랙티브 버튼',
  },
};
