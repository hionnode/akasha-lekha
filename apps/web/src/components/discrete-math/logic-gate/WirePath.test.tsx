import { render, screen } from '@solidjs/testing-library';
import { describe, it, expect } from 'vitest';
import { WirePath } from './WirePath';

vi.mock('animejs', () => ({
  animate: vi.fn(() => ({
    play: vi.fn(),
    pause: vi.fn(),
    cancel: vi.fn(),
  })),
  createTimeline: vi.fn(() => ({
    add: vi.fn().mockReturnThis(),
    play: vi.fn(),
    pause: vi.fn(),
    cancel: vi.fn(),
  })),
  stagger: vi.fn((val: number) => (_el: Element, i: number) => val * i),
}));

describe('WirePath', () => {
  it('renders a wire path', () => {
    render(() => (
      <svg>
        <WirePath fromX={0} fromY={0} toX={100} toY={100} id="test" />
      </svg>
    ));
    expect(screen.getByTestId('wire-test')).toBeInTheDocument();
  });

  it('renders path element with bezier curve', () => {
    render(() => (
      <svg>
        <WirePath fromX={0} fromY={50} toX={200} toY={50} id="straight" />
      </svg>
    ));
    const wire = screen.getByTestId('wire-straight');
    const path = wire.querySelector('path');
    expect(path).toBeInTheDocument();
    expect(path?.getAttribute('d')).toContain('M 0 50');
    expect(path?.getAttribute('d')).toContain('200 50');
  });

  it('uses active color when active', () => {
    render(() => (
      <svg>
        <WirePath fromX={0} fromY={0} toX={100} toY={0} active id="active" />
      </svg>
    ));
    const path = screen.getByTestId('wire-active').querySelector('path');
    expect(path?.getAttribute('stroke')).toBe('#9ece6a'); // signalActive
  });

  it('uses inactive color when not active', () => {
    render(() => (
      <svg>
        <WirePath fromX={0} fromY={0} toX={100} toY={0} id="inactive" />
      </svg>
    ));
    const path = screen.getByTestId('wire-inactive').querySelector('path');
    expect(path?.getAttribute('stroke')).toBe('#565f89'); // signalInactive
  });

  it('defaults id to "path" when not provided', () => {
    render(() => (
      <svg>
        <WirePath fromX={0} fromY={0} toX={100} toY={0} />
      </svg>
    ));
    expect(screen.getByTestId('wire-path')).toBeInTheDocument();
  });
});
