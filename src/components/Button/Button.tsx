/* eslint-disable react/button-has-type */
import React, { useRef, useState } from 'react';

import classNames from 'classnames';

type ButtonVariant = 'normal' | 'outline' | 'subtle' | 'ghost';

type ButtonColor =
  | 'base'
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'noborder';

type ButtonSize = 'normal' | 'sm' | 'xs';

type ButtonProps = {
  /**
   * Variant to use
   * @default 'normal'
   */
  variant?: ButtonVariant;
  /**
   * Color of the component
   * @default 'default'
   */
  color?: ButtonColor;
  /**
   * Size of the component
   * @default 'normal'
   */
  size?: ButtonSize;
  /**
   * Fill available width
   * @default 'false'
   */
  fullwidth?: boolean;
  /**
   * Disable hover actions
   * @default 'false'
   */
  noHover?: boolean;
  /**
   * Loading state
   * @default 'false'
   */
  loading?: boolean;
};

/**
 * Button to trigger an operation
 */
function Button({
  type = 'button',
  variant = 'normal',
  color = 'default',
  size = 'normal',
  fullwidth = false,
  noHover = false,
  loading = false,
  children,
  onClick,
  ...props
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ref = useRef<HTMLButtonElement>(null);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  React.useEffect(() => {
    if (ref.current && ref.current.getBoundingClientRect().width) {
      setWidth(ref.current.getBoundingClientRect().width);
    }
    if (ref.current && ref.current.getBoundingClientRect().height) {
      setHeight(ref.current.getBoundingClientRect().height);
    }
  }, [children]);

  return (
    <button
      ref={ref}
      type={type}
      className={classNames(
        `pm-c-button-${variant}--${color}`,
        `pm-c-button--${size}`,
        fullwidth && 'pm-c-button--fullwidth',
        noHover && 'pm-c-button--no-hover'
      )}
      style={
        loading
          ? {
              width: `${width}px`,
              height: `${height}px`
            }
          : {}
      }
      onClick={onClick}
      {...props}
    >
      {loading ? <span className="spinner" /> : children}
    </button>
  );
}

export default Button;
