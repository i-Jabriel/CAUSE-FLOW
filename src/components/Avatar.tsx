import React from 'react';
import type { TeamMember } from '../types';

// CAUSE brand palette per role
const ROLE_STYLE: Record<string, React.CSSProperties> = {
  business_developer: { backgroundColor: '#012340', color: '#6EEDC7' },
  project_manager:    { backgroundColor: '#0A3D6B', color: '#D0EFF2' },
  creative:           { backgroundColor: '#6EEDC7', color: '#012340' },
  operations:         { backgroundColor: '#D0EFF2', color: '#012340' },
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
  const roleStyle = ROLE_STYLE[member.role] || { backgroundColor: '#012340', color: '#6EEDC7' };
  const sizeClass = SIZE_CLASSES[size];

  const avatarEl = member.avatar ? (
    <img
      src={member.avatar}
      alt={member.name}
      className={`${sizeClass} rounded-full object-cover flex-shrink-0`}
      style={{ border: '2px solid rgba(110,237,199,0.3)' }}
    />
  ) : (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center font-bold flex-shrink-0 select-none`}
      style={{ ...roleStyle, border: '2px solid rgba(110,237,199,0.2)' }}
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
          <p className="text-sm font-medium leading-tight" style={{ color: '#012340' }}>{member.name}</p>
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

  return (
    <div className="flex -space-x-2">
      {visible.map((m) => {
        const roleStyle = ROLE_STYLE[m.role] || { backgroundColor: '#012340', color: '#6EEDC7' };
        return (
          <div key={m.id} className="relative" title={m.name}>
            {m.avatar ? (
              <img
                src={m.avatar}
                alt={m.name}
                className={`${sizeClass} rounded-full object-cover border-2 border-white flex-shrink-0`}
              />
            ) : (
              <div
                className={`${sizeClass} rounded-full flex items-center justify-center font-bold text-xs border-2 border-white flex-shrink-0 select-none`}
                style={roleStyle}
              >
                {m.initials}
              </div>
            )}
          </div>
        );
      })}
      {overflow > 0 && (
        <div
          className={`${sizeClass} rounded-full flex items-center justify-center font-semibold text-xs border-2 border-white flex-shrink-0`}
          style={{ backgroundColor: '#D0EFF2', color: '#012340' }}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
};
