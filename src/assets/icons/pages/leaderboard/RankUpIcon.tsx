import { memo } from 'react';

import { useTheme } from 'ui';

function RankUpIcon(props: React.SVGProps<SVGSVGElement>) {
  const theme = useTheme();
  const backgroundColor = theme.mode === 'dark' ? '#FFFFFF' : '#000000';

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
      <g clipPath="url(#clip0_2442_57777)">
        <path
          fill="#3EBD93"
          d="M10 5.75c-.204 0-.396.1-.512.267l-4.375 6.25a.625.625 0 00.512.983h8.75a.624.624 0 00.512-.983l-4.375-6.25A.622.622 0 0010 5.75h-.002c.001 0 .001 0 0 0z"
        />
      </g>
    </svg>
  );
}

export default memo(RankUpIcon);
