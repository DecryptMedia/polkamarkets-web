import { memo } from 'react';

import { isThemeDark, useTheme } from 'ui';

function SecondPlaceIcon(props: React.SVGProps<SVGSVGElement>) {
  const theme = useTheme();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <mask
        id="mask0_2445_47025"
        style={{ maskType: 'alpha' }}
        width="16"
        height="17"
        x="0"
        y="0"
        maskUnits="userSpaceOnUse"
      >
        <path
          fill="#F7C948"
          d="M15.045 12.825l-6.933-3.2a.265.265 0 00-.224 0l-6.933 3.2a.267.267 0 00-.155.242V15.2c0 .442.359.8.8.8h12.8a.8.8 0 00.8-.8v-2.133a.267.267 0 00-.155-.242zm0-4.8l-6.933-3.2a.265.265 0 00-.224 0l-6.933 3.2a.267.267 0 00-.155.242v2.667a.268.268 0 00.378.242L8 8.028l6.82 3.148a.272.272 0 00.257-.018.268.268 0 00.123-.224V8.267a.267.267 0 00-.155-.242zm0-4.8L8.112.025a.265.265 0 00-.224 0l-6.933 3.2a.267.267 0 00-.155.242v2.667a.267.267 0 00.378.242L8 3.228l6.82 3.148a.271.271 0 00.257-.018.268.268 0 00.123-.224V3.467a.267.267 0 00-.155-.242z"
        />
      </mask>
      <g mask="url(#mask0_2445_47025)">
        <path
          fill={isThemeDark(theme.device.mode) ? '#3B4760' : '#C3CCDA'}
          d="M-11 -1H25V17H-11z"
        />
        <path fill="#8976FF" d="M-9.5 11.5L8 4l20 10-20 8-17.5-10.5z" />
      </g>
    </svg>
  );
}

export default memo(SecondPlaceIcon);
