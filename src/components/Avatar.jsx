import { getInitials } from '../utils/formatters';

export const Avatar = ({ 
  src, 
  alt = 'User avatar', 
  size = 'md',
  name = '',
  className = '',
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
    '2xl': 'w-32 h-32 text-3xl',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizes[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  const initials = name ? getInitials(name) : '?';

  return (
    <div
      className={`${sizes[size]} rounded-full bg-primary text-white flex items-center justify-center font-semibold ${className}`}
    >
      {initials}
    </div>
  );
};
