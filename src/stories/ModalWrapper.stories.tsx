import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { createPortal } from 'react-dom';
import { ReactNode, useRef, useState, useEffect } from 'react';
import Button from '@/components/commons/Button';

// SVG 대신 span을 사용하는 ModalWrapper 컴포넌트
interface ModalWrapperProps {
  title?: string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
}

function ModalWrapper({
  title,
  children,
  onClose,
  className,
}: ModalWrapperProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // useClickOutside 대신 간단한 클릭 핸들러
  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
      onClick={handleClickOutside}
    >
      <div ref={modalRef} className={className}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4"
          aria-label="모달 닫기"
        >
          <span>✕</span>
        </button>
        {title && (
          <h2 className="mb-[2rem] text-lg font-semibold text-gray-100">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );

  if (!mounted) {
    return null;
  }

  return createPortal(
    modalContent,
    document.getElementById('modal-root') || document.body,
  );
}

const meta: Meta<typeof ModalWrapper> = {
  title: 'Components/Modal/ModalWrapper',
  component: ModalWrapper,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: { type: 'text' },
      description: '모달 제목',
    },
    onClose: {
      action: 'closed',
      description: '닫기 이벤트 핸들러',
    },
    className: {
      control: { type: 'text' },
      description: '추가 CSS 클래스',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ModalWrapper>;

export const BasicModal: Story = {
  args: {
    title: '기본 모달',
    onClose: () => console.log('Modal closed'),
    children: (
      <div className="p-4">
        <p>모달 내용입니다.</p>
        <Button onClick={() => console.log('Button clicked')}>확인</Button>
      </div>
    ),
    className:
      'relative w-[28.125rem] rounded-lg bg-[#242429] p-[1.5rem] text-gray-100',
  },
};

export const ModalWithoutTitle: Story = {
  args: {
    onClose: () => console.log('Modal closed'),
    children: (
      <div className="p-4 text-center">
        <p>제목이 없는 모달입니다.</p>
        <div className="mt-4 flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => console.log('Cancel clicked')}
          >
            취소
          </Button>
          <Button onClick={() => console.log('Confirm clicked')}>확인</Button>
        </div>
      </div>
    ),
    className:
      'relative w-[28.125rem] rounded-lg bg-[#242429] p-[1.5rem] text-gray-100',
  },
};

export const LargeModal: Story = {
  args: {
    title: '큰 모달',
    onClose: () => console.log('Modal closed'),
    children: (
      <div className="p-4">
        <p>여기에 내용이 표시됨</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => console.log('Cancel clicked')}
          >
            취소
          </Button>
          <Button onClick={() => console.log('Confirm clicked')}>확인</Button>
        </div>
      </div>
    ),
    className:
      'relative w-[40rem] max-h-[80vh] rounded-lg bg-[#242429] p-[1.5rem] text-gray-100 overflow-y-auto',
  },
};
