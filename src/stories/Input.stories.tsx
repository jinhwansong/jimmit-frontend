import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { ErrorMessage } from '@hookform/error-message';
import {
  FormProvider,
  useForm,
  useFormContext,
  RegisterOptions,
} from 'react-hook-form';
import Button from '@/components/commons/Button';

// SVG 대신 span을 사용하는 Input 컴포넌트
interface InputProps {
  name: string;
  type: string;
  rules?: RegisterOptions;
  minLength?: number;
  maxLength?: number;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string | React.ReactNode;
  placeholder?: string;
  defaultValue?: string | number;
  innerRef?: React.RefObject<HTMLInputElement | null>;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isrightbutton?: boolean;
  rightButtonDisabled?: boolean;
  onRightButtonClick?: () => void;
  children?: React.ReactNode;
  autoComplete?: string;
}

function Input({
  name,
  type,
  rules,
  minLength,
  maxLength,
  onFocus,
  onBlur,
  onChange,
  label,
  placeholder,
  defaultValue,
  innerRef,
  size,
  isrightbutton,
  rightButtonDisabled,
  onRightButtonClick,
  children,
  autoComplete = 'off',
}: InputProps) {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  const IsError = errors[name];
  const IsPwd = type === 'password';
  const [showPassword, setShowPassword] = React.useState(false);

  const sizeClass = {
    xs: 'tab:w-[17.6875rem] w-[13.125rem]',
    sm: 'pc:w-[25rem] w-[19.4375rem]',
    md: 'w-[28rem]',
    lg: 'w-full pc:w-[56rem]',
    xlg: 'w-full',
  }[size || 'xlg'];

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const newValue = e.target.value;
    setValue(name, newValue);
    if (onChange) {
      onChange(e);
    }
  };

  const onInputFocus = React.useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (onFocus) {
        onFocus(e);
      }
    },
    [onFocus],
  );

  const onInputBlur = React.useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (onBlur) {
        onBlur(e);
      }
    },
    [onBlur],
  );

  const { ref, ...rest } = register(name, {
    onChange: handleChange,
    onBlur: onInputBlur,
    ...rules,
    shouldUnregister: true,
  });

  return (
    <>
      <div className="flex flex-col gap-[0.5rem]">
        <label
          htmlFor={name}
          className="block text-sm font-semibold text-gray-100"
        >
          {label}
        </label>
        <div className={`relative ${sizeClass}`}>
          <div className="flex flex-row items-center gap-[0.5rem]">
            <input
              id={name}
              type={IsPwd ? (showPassword ? 'text' : 'password') : type}
              onFocus={onInputFocus}
              placeholder={placeholder}
              defaultValue={defaultValue}
              minLength={minLength}
              maxLength={maxLength}
              autoComplete={autoComplete}
              ref={(el) => {
                ref(el);
                if (innerRef) {
                  innerRef.current = el;
                }
              }}
              {...rest}
              className={`h-[2.75rem] w-full rounded-lg border-0 bg-[#34343A] px-[1rem] py-[0.625rem] ${
                IsError
                  ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500'
                  : 'focus-within:ring-0 focus-within:outline-none'
              }`}
            />
            {isrightbutton && (
              <Button
                type="button"
                variant="outline"
                className="w-auto max-w-[6.8125rem] min-w-[5.8125rem]"
                onClick={onRightButtonClick}
                disabled={rightButtonDisabled}
              >
                {children}
              </Button>
            )}
          </div>
          {IsPwd && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-3 -translate-y-1/2"
              aria-label="비밀번호 숨김 버튼"
            >
              {/* SVG 대신 span 사용 */}
              {showPassword ? <span>👁️</span> : <span>🙈</span>}
            </button>
          )}
        </div>
        <ErrorMessage
          errors={errors}
          name={name}
          render={({ message }) => (
            <p className="mt-1 text-sm text-red-500">{message}</p>
          )}
        />
      </div>
    </>
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  const methods = useForm();
  return <FormProvider {...methods}>{children}</FormProvider>;
}

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  decorators: [
    (Story) => (
      <Wrapper>
        <div style={{ maxWidth: '400px', padding: '1rem' }}>
          <Story />
        </div>
      </Wrapper>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    name: {
      description: 'react-hook-form에서 사용하는 name 속성',
    },
    type: {
      control: { type: 'select' },
      options: ['text', 'password'],
    },
    label: { control: 'text' },
    placeholder: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    name: 'default',
    type: 'text',
    label: '기본 텍스트',
    placeholder: '내용을 입력하세요',
  },
};

export const Password: Story = {
  args: {
    name: 'password',
    type: 'password',
    label: '비밀번호',
    placeholder: '비밀번호를 입력하세요',
  },
};

export const WithValidation: Story = {
  args: {
    name: 'email',
    type: 'email',
    label: '이메일',
    placeholder: 'email@example.com',
    rules: {
      required: '이메일은 필수입니다.',
      pattern: {
        value: /^\S+@\S+\.\S+$/,
        message: '올바른 이메일 형식을 입력하세요.',
      },
    },
  },
};

export const WithRightButton: Story = {
  args: {
    name: 'verificationCode',
    type: 'text',
    label: '인증 코드',
    placeholder: '인증 코드를 입력하세요',
    isrightbutton: true,
    onRightButtonClick: () => console.log('인증 코드 발송'),
    children: '발송',
  },
};
