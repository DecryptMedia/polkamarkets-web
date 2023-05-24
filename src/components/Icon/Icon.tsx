import { memo } from 'react';

import cn from 'classnames';

import * as Svgs from './__svgs__';
import IconClasses from './Icon.module.scss';

export interface IconProps extends React.ComponentPropsWithRef<'svg'> {
  dir?: 'left' | 'up' | 'right' | 'down';
  name: keyof typeof Svgs;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  title?: string;
}

function Icon({ size = 'md', name, dir, className, ...props }: IconProps) {
  const { title } = props;
  const Svg = Svgs[name];

  return (
    <Svg
      focusable="false"
      className={cn(
        IconClasses.root,
        {
          [IconClasses.sm]: size === 'sm',
          [IconClasses.md]: size === 'md',
          [IconClasses.lg]: size === 'lg',
          [IconClasses.xl]: size === 'xl',
          [IconClasses.left]: dir === 'left',
          [IconClasses.up]: dir === 'up',
          [IconClasses.right]: dir === 'right',
          [IconClasses.down]: dir === 'down'
        },
        className
      )}
      {...(!title && {
        'aria-hidden': 'true'
      })}
      {...props}
    />
  );
}

Icon.displayName = 'Icon';

export default memo(Icon, Object.is);
