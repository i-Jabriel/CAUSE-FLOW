import React from 'react';
import type { TeamMember } from '../types';

const ROLE_COLORS: Record<string, string> = {
  business_developer: 'bg-black text-white',
  project_manager: 'bg-[#2A4570] text-white',
  creative: 'bg-[#3D6494] text-white',
  operations: 'bg-[#7A9BBF] text-white',
};

interface AvatarProps {
  member: TeamMember;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
  showRole?: boolean;
}

const SIZE_CLASSES = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

export const Avatar: React.FC<AvatarProps> = ({
  member,
  size = 'md',
  showName = false,
  showRole = false,
}) => {
  const colorClass = ROLE_COLORS[member.role] || 'bg-zinc-600 text-white';
  const sizeClass = SIZE_CLASSES[size];

  const avatarEl = member.avatar ? (
    <img
      src={member.avatar}
      alt={member.name}
      className={`${sizeClass} rounded-full object-cover border border-zinc-200 flex-shrink-0`}
    />
  ) : (
    <div
      className={`${sizeClass} ${colorClass} rounded-full flex items-center justify-center font-semibold flex-shrink-0 select-none border border-zinc-200`}
    >
      {member.initials}
    </div>
  );

  if (!showName && !showRole) return avatarEl;

  return (
    <div className="flex items-center gap-2.5">
      {avatarEl}
      <div>
        {showName && (
          <p className="text-sm font-medium text-zinc-900 leading-tight">{member.name}</p>
        )}
        {showRole && (
          <p className="text-xs text-zinc-500 leading-tight">{member.title}</p>
        )}
      </div>
    </div>
  );
};

interface AvatarGroupProps {
  members: TeamMember[];
  max?: number;
  size?: 'xs' | 'sm' | 'md';
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  members,
  max = 4,
  size = 'sm',
}) => {
  const visible = members.slice(0, max);
  const overflow = members.length - max;
  const sizeClass = SIZE_CLASSES[size];
  const colorClass = ROLE_COLORS;

  return (
    <div className="flex -space-x-2">
      {visible.map((m) => (
        <div key={m.id} className="relative" title={m.name}>
          {m.avatar ? (
            <img
              src={m.avatar}
              alt={m.name}
              className={`${sizeClass} rounded-full object-cover border-2 border-white flex-shrink-0`}
            />
          ) : (
            <div
              className={`${sizeClass} ${colorClass[m.role] || 'bg-zinc-600 text-white'} rounded-full flex items-center justify-center font-semibold text-xs border-2 border-white flex-shrink-0 select-none`}
            >
              {m.initials}
            </div>
          )}
        </div>
      ))}
      {overflow > 0 && (
        <div
          className={`${sizeClass} bg-zinc-200 text-zinc-600 rounded-full flex items-center justify-center font-semibold text-xs border-2 border-white flex-shrink-0`}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
};
