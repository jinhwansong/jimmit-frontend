import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { useCallback, useMemo, useState } from 'react';
import { clsx } from 'clsx';

// SVG 대신 span을 사용하는 TagSelector 컴포넌트
interface TagSelectorProps {
  tags: string[];
  mode: 'selectable' | 'readonly';
  initialSelected?: string[];
  onChange?: (selected: string[]) => void;
  disabledTags?: string[];
  selectMode?: 'single' | 'multiple';
}

function TagSelector({
  tags,
  mode = 'selectable',
  selectMode = 'multiple',
  initialSelected = [],
  disabledTags = [],
  onChange,
}: TagSelectorProps) {
  const [selected, setSelected] = useState<string[]>(
    mode === 'selectable' ? initialSelected : [],
  );

  const selectedSet = useMemo(() => {
    return new Set(mode === 'readonly' ? initialSelected : selected);
  }, [mode, initialSelected, selected]);

  const disabledSet = useMemo(() => new Set(disabledTags), [disabledTags]);

  const toggleTag = useCallback(
    (tag: string) => {
      if (mode === 'readonly' || disabledSet.has(tag)) {
        return;
      }

      setSelected((prev) => {
        let newSelected: string[];

        if (selectMode === 'single') {
          newSelected = prev.includes(tag) ? [] : [tag];
        } else {
          newSelected = prev.includes(tag)
            ? prev.filter((t) => t !== tag)
            : [...prev, tag];
        }

        setTimeout(() => {
          onChange?.(newSelected);
        }, 0);

        return newSelected;
      });
    },
    [mode, onChange, disabledSet, selectMode],
  );

  return (
    <div>
      <div className="flex flex-wrap gap-[0.5rem]">
        {tags.map((tag, index) => {
          const isActive = selectedSet.has(tag);
          const isDisabled = disabledSet.has(tag);

          const baseClass =
            'box-border flex h-[2rem] items-center justify-center rounded-[0.5rem] border bg-[#34343a] pr-[0.5rem] pl-[0.75rem] text-sm font-medium text-gray-100';
          const activeClass = isActive
            ? 'border-[#9747FF] shadow-md'
            : 'border-transparent';
          const disabledClass = isDisabled
            ? 'opacity-50 cursor-not-allowed'
            : mode === 'selectable'
              ? 'cursor-pointer'
              : 'cursor-default';

          // SVG 대신 span 사용
          const icon = isActive || isDisabled ? <span>✓</span> : <span>+</span>;

          return (
            <button
              type="button"
              key={`${tag}-${index}`}
              onClick={() => toggleTag(tag)}
              className={clsx(baseClass, activeClass, disabledClass)}
            >
              {tag}
              {icon}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const meta: Meta<typeof TagSelector> = {
  title: 'Components/TagSelector',
  component: TagSelector,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '600px', padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    tags: {
      control: { type: 'object' },
      description: 'Array of tag strings to display',
    },
    mode: {
      control: { type: 'select' },
      options: ['selectable', 'readonly'],
      description: 'Whether tags can be selected or are read-only',
    },
    selectMode: {
      control: { type: 'select' },
      options: ['single', 'multiple'],
      description: 'Selection mode - single or multiple tags',
    },
    initialSelected: {
      control: { type: 'object' },
      description: 'Initially selected tags',
    },
    disabledTags: {
      control: { type: 'object' },
      description: 'Tags that are disabled and cannot be selected',
    },
    onChange: {
      action: 'changed',
      description: 'Callback fired when selection changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TagSelector>;

export const Default: Story = {
  args: {
    tags: ['Rock', 'Jazz', 'Pop', 'Classical', 'Electronic', 'Hip-Hop'],
    mode: 'selectable',
    selectMode: 'multiple',
    initialSelected: [],
    disabledTags: [],
  },
};

export const MusicGenres: Story = {
  args: {
    tags: [
      'Rock',
      'Jazz',
      'Pop',
      'Classical',
      'Electronic',
      'Hip-Hop',
      'Blues',
      'Country',
    ],
    initialSelected: ['Rock', 'Jazz'],
  },
};

export const BandSessions: Story = {
  args: {
    tags: [
      'Vocals',
      'Guitar',
      'Bass',
      'Drums',
      'Keyboard',
      'Saxophone',
      'Trumpet',
      'Violin',
    ],
    selectMode: 'multiple',
    initialSelected: ['Guitar', 'Bass'],
  },
};

export const SingleGenreSelection: Story = {
  args: {
    tags: ['Rock', 'Jazz', 'Pop', 'Classical', 'Electronic', 'Hip-Hop'],
    selectMode: 'single',
    initialSelected: ['Rock'],
  },
};

export const ReadonlyBandSessions: Story = {
  args: {
    tags: ['Vocals', 'Guitar', 'Bass', 'Drums', 'Keyboard'],
    mode: 'readonly',
    initialSelected: ['Guitar', 'Bass', 'Drums'],
  },
};

export const ComplexExample: Story = {
  args: {
    tags: ['Vocals', 'Guitar', 'Bass', 'Drums', 'Keyboard'],
    initialSelected: ['Guitar'],
    disabledTags: ['Vocals'],
    selectMode: 'multiple',
  },
};
