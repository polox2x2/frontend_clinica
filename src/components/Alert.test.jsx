import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Alert from './Alert';

describe('Alert', () => {
  it('does not render when message is empty', () => {
    const { container } = render(<Alert message="" />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders the provided message', () => {
    render(<Alert type="success" message="Operacion exitosa" />);

    expect(screen.getByText('Operacion exitosa')).toBeInTheDocument();
  });

  it('falls back to info styles for unknown types', () => {
    render(<Alert type="unknown" message="Mensaje informativo" />);

    expect(screen.getByText('Mensaje informativo')).toBeInTheDocument();
  });
});
