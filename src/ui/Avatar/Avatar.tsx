import cn from 'classnames';

import avatarClasses from './Avatar.module.scss';

export const avatarProps = {
  $size: ['sm', 'md', 'lg'],
  $radius: ['sm', 'md', 'lg']
} as const;

export interface AvatarProps
  extends Pick<
    React.ComponentPropsWithoutRef<'img'>,
    'src' | 'alt' | 'className'
  > {
  $size?: typeof avatarProps.$size[number];
  $radius?: typeof avatarProps.$radius[number];
}

export default function Avatar({
  $size,
  $radius,
  className,
  ...props
}: AvatarProps) {
  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img
      className={cn(
        {
          [avatarClasses.radiusSm]: $radius === 'sm',
          [avatarClasses.radiusMd]: $radius === 'md',
          [avatarClasses.radiusLg]: $radius === 'lg',
          [avatarClasses.sizeSm]: $size === 'sm',
          [avatarClasses.sizeMd]: $size === 'md',
          [avatarClasses.sizeLg]: $size === 'lg'
        },
        className
      )}
      {...props}
    />
  );
}
