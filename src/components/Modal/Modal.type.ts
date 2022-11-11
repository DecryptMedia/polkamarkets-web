import type { HTMLMotionProps } from 'framer-motion';

type ModalComponents = 'root' | 'dialog' | 'hide';

export interface ModalProps extends Omit<HTMLMotionProps<'div'>, 'className'> {
  onHide?(): void;
  show: boolean;
  className?: Partial<Record<ModalComponents, string>>;
  backdrop?: boolean;
  centered?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  disableFocustrap?: boolean;
}
