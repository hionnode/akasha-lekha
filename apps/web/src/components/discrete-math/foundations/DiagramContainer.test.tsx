import { render, screen } from '@solidjs/testing-library';
import { describe, it, expect } from 'vitest';
import { DiagramContainer } from './DiagramContainer';

describe('DiagramContainer', () => {
  it('renders an SVG with default dimensions', () => {
    render(() => (
      <DiagramContainer>
        <rect x="0" y="0" width="10" height="10" />
      </DiagramContainer>
    ));

    const container = screen.getByTestId('diagram-container');
    expect(container).toBeInTheDocument();

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg?.getAttribute('viewBox')).toBe('0 0 600 400');
    expect(svg?.getAttribute('width')).toBe('100%');
  });

  it('uses custom viewBox when provided', () => {
    render(() => (
      <DiagramContainer viewBox="0 0 800 600">
        <circle cx="50" cy="50" r="10" />
      </DiagramContainer>
    ));

    const svg = screen.getByTestId('diagram-container').querySelector('svg');
    expect(svg?.getAttribute('viewBox')).toBe('0 0 800 600');
  });

  it('applies custom class', () => {
    render(() => (
      <DiagramContainer class="my-custom-class">
        <rect x="0" y="0" width="10" height="10" />
      </DiagramContainer>
    ));

    const container = screen.getByTestId('diagram-container');
    expect(container.className).toContain('my-custom-class');
  });

  it('renders children inside SVG', () => {
    render(() => (
      <DiagramContainer>
        <text data-testid="inner-text">Hello</text>
      </DiagramContainer>
    ));

    expect(screen.getByTestId('inner-text')).toBeInTheDocument();
  });

  it('includes noscript fallback', () => {
    render(() => (
      <DiagramContainer fallbackText="Custom fallback">
        <rect x="0" y="0" width="10" height="10" />
      </DiagramContainer>
    ));

    const noscript = screen.getByTestId('diagram-container').querySelector('noscript');
    expect(noscript).toBeInTheDocument();
  });
});
