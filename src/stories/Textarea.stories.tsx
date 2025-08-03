import type { Meta, StoryObj } from '@storybook/react';
import TextArea, { TextAreaProps } from '@/components/commons/Textarea';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

function Wrapper({ children }: { children: React.ReactNode }) {
  const methods = useForm();
  return <FormProvider {...methods}>{children}</FormProvider>;
}

const meta: Meta<typeof TextArea> = {
  title: 'Components/TextArea',
  component: TextArea,
  decorators: [
    (Story) => (
      <Wrapper>
        <div style={{ maxWidth: '600px', padding: '1rem' }}>
          <Story />
        </div>
      </Wrapper>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    name: {
      description: 'react-hook-form에서 사용하는 name 속성',
      control: 'text',
    },
    placeholder: {
      description: '텍스트 영역의 플레이스홀더',
      control: 'text',
    },
    width: {
      description: '텍스트 영역의 너비',
      control: { type: 'select' },
      options: ['w-full', 'w-96', 'w-80', 'w-64'],
    },
    minLength: {
      description: '최소 입력 글자수',
      control: 'number',
    },
    maxLength: {
      description: '최대 입력 글자수',
      control: 'number',
    },
  },
  args: {
    placeholder: '내용을 입력하세요',
    width: 'w-full',
  },
};
export default meta;

type Story = StoryObj<typeof TextArea>;

// react-hook-form 컨텍스트를 제공하는 컨트롤 컴포넌트
function ControlledTextArea(props: Partial<TextAreaProps>) {
  const methods = useForm({ mode: 'onChange' });

  // 에러를 일부러 넣는 로직 (minLength 10)
  React.useEffect(() => {
    methods.trigger(props.name ?? ''); // 렌더 후 validation 강제 실행
  }, [methods, props.name]);

  return (
    <FormProvider {...methods}>
      <TextArea {...(props as TextAreaProps)} />
    </FormProvider>
  );
}

export const Default: Story = {
  render: (args) => <ControlledTextArea {...args} name="default" />,
  args: {
    placeholder: '내용을 입력하세요',
  },
};

export const WithValidation: Story = {
  render: (args) => (
    <ControlledTextArea
      {...args}
      name="validation"
      minLength={10}
      maxLength={100}
      rules={{
        required: '내용을 입력해주세요.',
        minLength: {
          value: 10,
          message: '최소 10자 이상 입력해주세요.',
        },
        maxLength: {
          value: 100,
          message: '최대 100자까지 입력 가능합니다.',
        },
      }}
    />
  ),
  args: {
    placeholder: '최소 10자, 최대 100자까지 입력하세요',
  },
};

export const CustomWidth: Story = {
  render: (args) => <ControlledTextArea {...args} name="customWidth" />,
  args: {
    placeholder: '커스텀 너비 텍스트 영역',
    width: 'w-96',
  },
};

export const ErrorState: Story = {
  render: (args) => (
    <ControlledTextArea
      {...args}
      name="error"
      minLength={10}
      rules={{
        required: '내용을 입력해주세요.',
        minLength: {
          value: 10,
          message: '최소 10자 이상 입력해주세요.',
        },
      }}
    />
  ),
  args: {
    placeholder: '최소 10자 이상 입력하세요 (에러 상태)',
  },
};

export const WithMaxLength: Story = {
  render: (args) => (
    <ControlledTextArea
      {...args}
      name="maxLength"
      maxLength={50}
      rules={{
        maxLength: {
          value: 50,
          message: '최대 50자까지 입력 가능합니다.',
        },
      }}
    />
  ),
  args: {
    placeholder: '최대 50자까지 입력 가능합니다',
  },
};
