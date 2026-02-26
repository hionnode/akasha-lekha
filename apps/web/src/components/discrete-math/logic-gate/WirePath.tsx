import { createSignal, onMount } from 'solid-js';
import { colors } from '../foundations/colors';
import { useAnime } from '../foundations/useAnime';

export interface WirePathProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  active?: boolean;
  animated?: boolean;
  id?: string;
}

function bezierPath(x1: number, y1: number, x2: number, y2: number): string {
  const dx = Math.abs(x2 - x1) * 0.5;
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

export function WirePath(props: WirePathProps) {
  const [pulseProgress, setPulseProgress] = createSignal(0);
  const { animate } = useAnime();
  let pathRef: SVGPathElement | undefined;
  let pulseRef: SVGCircleElement | undefined;

  const path = () => bezierPath(props.fromX, props.fromY, props.toX, props.toY);
  const wireColor = () => props.active ? colors.signalActive : colors.signalInactive;

  onMount(async () => {
    if (props.animated && props.active && pulseRef && pathRef) {
      const length = pathRef.getTotalLength();
      // Proxy object for anime.js to animate a numeric value
      const proxy = { t: 0 };
      await animate(proxy as unknown as Element, {
        t: [0, 1],
        duration: 600,
        loop: true,
        onUpdate: () => {
          setPulseProgress(proxy.t);
          if (pathRef && pulseRef) {
            const point = pathRef.getPointAtLength(proxy.t * length);
            pulseRef.setAttribute('cx', String(point.x));
            pulseRef.setAttribute('cy', String(point.y));
          }
        },
      });
    }
  });

  return (
    <g data-testid={`wire-${props.id ?? 'path'}`}>
      {/* Wire path */}
      <path
        ref={pathRef}
        d={path()}
        fill="none"
        stroke={wireColor()}
        stroke-width="2"
        stroke-linecap="round"
      />

      {/* Signal pulse dot */}
      {props.animated && props.active && (
        <circle
          ref={pulseRef}
          r={3}
          fill={colors.signalActive}
          opacity={0.8}
        />
      )}
    </g>
  );
}

export default WirePath;
