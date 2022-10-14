import { render, screen } from '@testing-library/react';

import Icon from './Icon';
import IconClasses from './Icon.module.scss';

describe('Icon', () => {
  it('renders its injected props', () => {
    const { container } = render(<Icon name="Arrow" />);

    expect(container.childNodes[0]).toHaveAttribute('focusable', 'false');
    expect(container.childNodes[0]).toHaveAttribute('aria-hidden', 'true');
    expect(container.childNodes[0]).toHaveClass(
      IconClasses.root,
      IconClasses.md
    );
  });
  it('is accessible if it has [title]', () => {
    render(<Icon name="Arrow" title="back to somewhere else" />);

    const icon = screen.getByTitle(/back to somewhere else/);

    expect(icon).toBeInTheDocument();
    expect(icon).not.toHaveAttribute('aria-hidden');
  });
  it('is sizing responsive', () => {
    const sizes = ['sm', 'md', 'lg'] as const;

    sizes.forEach(size => {
      const { container } = render(<Icon name="Arrow" size={size} />);

      expect(container.childNodes[0]).toHaveClass(IconClasses[size]);
    });
  });
});
