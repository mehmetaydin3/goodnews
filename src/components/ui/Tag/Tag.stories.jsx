import { useState } from 'react';
import { Tag } from './Tag';

export default {
  title: 'Design System/Tag',
  component: Tag,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'genre', 'skill'],
    },
    removable: { control: 'boolean' },
    label: { control: 'text' },
    onRemove: { action: 'removed' },
  },
};

export const Default = {
  args: {
    label: 'Electronic',
    variant: 'default',
  },
};

export const Genre = {
  args: {
    label: 'Hip-Hop',
    variant: 'genre',
  },
};

export const Skill = {
  args: {
    label: 'Beat Making',
    variant: 'skill',
  },
};

export const Removable = {
  args: {
    label: 'R&B',
    variant: 'genre',
    removable: true,
  },
};

export const RemovableInteractive = {
  render: () => {
    const [tags, setTags] = useState(['Hip-Hop', 'R&B', 'Trap', 'Lo-fi', 'Soul']);

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxWidth: '400px' }}>
        {tags.map((tag) => (
          <Tag
            key={tag}
            label={tag}
            variant="genre"
            removable
            onRemove={() => setTags((prev) => prev.filter((t) => t !== tag))}
          />
        ))}
        {tags.length === 0 && (
          <span style={{ fontSize: '13px', color: '#737373', fontFamily: 'sans-serif' }}>
            All tags removed. Refresh to reset.
          </span>
        )}
      </div>
    );
  },
};

export const AllVariants = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        <Tag label="Hip-Hop" variant="genre" />
        <Tag label="R&B" variant="genre" />
        <Tag label="Trap" variant="genre" />
        <Tag label="Electronic" variant="genre" />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        <Tag label="Mixing" variant="skill" />
        <Tag label="Mastering" variant="skill" />
        <Tag label="Songwriting" variant="skill" />
        <Tag label="Vocal Production" variant="skill" />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        <Tag label="Default Tag" variant="default" />
        <Tag label="Another Tag" variant="default" />
      </div>
    </div>
  ),
};
