import {Curve, Line, LineProps} from '@motion-canvas/2d';
import {
  SignalValue,
  createComputed,
  range,
  unwrap,
  useRandom,
} from '@motion-canvas/core';

export function DistortedCurve(props: {
  curve: SignalValue<Curve>;
  displacement?: number;
  count?: number;
  samples?: number;
  lineProps: LineProps;
}) {
  const c = unwrap(props.curve);
  const points = createComputed(() =>
    range((props.samples ?? 100) + 1).map(
      i => c.getPointAtPercentage(i / props.samples).position,
    ),
  );
  const dpl = props.displacement ?? 10;
  const displacementMaps: [number, number][][] = range(props.count ?? 1).map(
    () =>
      range(1 + (props.samples ?? 100)).map(() => [
        useRandom().nextFloat(-dpl, dpl),
        useRandom().nextFloat(-dpl, dpl),
      ]),
  );
  return (
    <>
      {range(props.count ?? 1).map(ci => {
        const displaced = createComputed(() =>
          points().map((p, pi) => p.add(displacementMaps[ci][pi])),
        );
        return <Line {...props.lineProps} points={displaced} closed></Line>;
      })}
    </>
  );
}
