import { SVGProps, memo } from 'react';

import { useTheme } from 'hooks';

function RankStableIcon(props: SVGProps<SVGSVGElement>) {
  const { theme } = useTheme();

  const backgroundColor = theme === 'dark' ? '#FFFFFF' : '#000000';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 20 20"
      {...props}
    >
      <rect
        width="20"
        height="20"
        y="0"
        fill={backgroundColor}
        fillOpacity="0.1"
        rx="10"
      />
      <rect width="11" height="3" x="4.5" y="8.5" fill="#8B96A7" rx="1.5" />
    </svg>
  );
}

export default memo(RankStableIcon);
