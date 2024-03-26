import {Layout, View2D} from '@motion-canvas/2d';
import {
  Reference,
  SignalValue,
  SimpleSignal,
  Vector2,
  createSignal,
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
