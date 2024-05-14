import {Curve, Layout, PossibleCanvasStyle, View2D} from '@motion-canvas/2d';
import {
  Reference,
  SignalValue,
  SimpleSignal,
  Vector2,
  all,
  createSignal,
  delay,
  unwrap,
} from '@motion-canvas/core';

export function belowScreenPosition<T extends Layout>(
  view: View2D,
  node: SignalValue<T>,
): Vector2 {
  const n = unwrap(node);
  return new Vector2({
    x: n.position().x,
    y: view.size().y / 2 + n.height() / 2,
  });
}

export function signalRef<T>(): {ref: Reference<T>; signal: SimpleSignal<T>} {
  const s = createSignal();
  // @ts-ignore
  return {ref: s, signal: s};
}

export function signum(value: number): number {
  return value > 0 ? 1 : value < 0 ? -1 : 0;
}

export function* drawIn(
  nodeOrRef: SignalValue<Curve>,
  stroke: PossibleCanvasStyle,
  fill: PossibleCanvasStyle,
  duration: number,
  restoreStroke: boolean = false,
  defaultStrokeWidth: number = 4,
) {
  const node = unwrap(nodeOrRef);
  const prevStroke = node.stroke();
  const oldStrokeWidth = node.lineWidth();
  const strokeWidth =
    node.lineWidth() > 0 ? node.lineWidth() : defaultStrokeWidth;
  node.end(0);
  node.lineWidth(strokeWidth);
  node.stroke(stroke);
  yield* node.end(1, duration * 0.7);
  yield* node.fill(fill, duration * 0.3);
  if (restoreStroke) {
    yield delay(
      duration * 0.1,
      all(
        node.lineWidth(oldStrokeWidth, duration * 0.7),
        node.stroke(prevStroke, duration * 0.7),
      ),
    );
  }
}

function getLinkPoints(node: Layout) {
  return [node.left(), node.right(), node.top(), node.bottom()];
}

export function getClosestLinkPoints(
  a: SignalValue<Layout>,
  b: SignalValue<Layout>,
): [Vector2, Vector2] {
  const aPoints = getLinkPoints(unwrap(a));
  const bPoints = getLinkPoints(unwrap(b));

  const aClosest = aPoints.map(aPoint => {
    return bPoints.map(bPoint => {
      return {
        aPoint,
        bPoint,
        distanceSq:
          Math.pow(aPoint.x - bPoint.x, 2) + Math.pow(aPoint.y - bPoint.y, 2),
      };
    });
  });

  const min = aClosest.reduce(
    (a, b) => {
      const bMin = b.reduce((a, b) => {
        return a.distanceSq < b.distanceSq ? a : b;
      });
      return a.distanceSq < bMin.distanceSq ? a : bMin;
    },
    {aPoint: {x: 0, y: 0}, bPoint: {x: 0, y: 0}, distanceSq: Infinity},
  );
  delete min.distanceSq;
  return [new Vector2(min.aPoint), new Vector2(min.bPoint)];
}
