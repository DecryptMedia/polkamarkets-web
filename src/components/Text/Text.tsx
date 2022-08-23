import React from 'react';

import classNames from 'classnames';

type TextType =
  | 'p'
  | 'span'
  | 'br'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'strong'
  | 'em'
  | 'blockquote'
  | 'q'
  | 'hr'
  | 'code'
  | 'pre'
  | 'mark'
  | 'ins'
  | 'del'
  | 'sup'
  | 'sub'
  | 'small'
  | 'label'
  | 'i'
  | 'b';

type TextScale =
  | 'heading-large'
  | 'heading'
  | 'body'
  | 'caption'
  | 'tiny'
  | 'tiny-uppercase';

type TextFontWeight = 'regular' | 'medium' | 'semibold' | 'bold';

type TextColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'light'
  | 'dark'
  | 'white'
  | 'white-50'
  | 'black'
  | 'gray'
  | 'lighter-gray-50'
  | 'lighter-gray-100'
  | 'lighter-gray'
  | 'light-gray'
  | 'dark-gray';

export type TextProps = {
  /**
   * HTML text element
   * @default 'p'
   */
  as?: TextType;
  /**
   * Scale of the text
   * @default 'body'
   */
  scale?: TextScale;
  /**
   * Font weight of the text
   * @default 'regular'
   */
  fontWeight?: TextFontWeight;
  /**
   * Color of the text
   */
  color?: TextColor;
  /**
   * Aditional class name
   */
  className?: string;
  /**
   * Aditional CSS inline style
   */
  style?: React.CSSProperties;
  children?: React.ReactNode | any;
};

/**
 * Basic text writing, including headings, body text, and more
 */
function Text({
  as = 'p',
  scale = 'body',
  fontWeight = 'regular',
  color,
  className,
  style,
  children
}: TextProps) {
  return React.createElement(
    as,
    {
      className: classNames(
        {
          [`text-${color}`]: color,
          [scale]: scale,
          [fontWeight]: fontWeight
        },
        className
      ),
      style
    },
    children
  );
}

Text.displayName = 'Text';

export default Text;
