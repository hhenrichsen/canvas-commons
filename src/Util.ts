import {Layout, View2D} from '@motion-canvas/2d';
import {
  Reference,
  SimpleSignal,
  Vector2,
  createSignal,
} from '@motion-canvas/core';

export function unref<T extends Layout>(possibleRef: T | Reference<T>): T {
  return typeof possibleRef == 'function' ? possibleRef() : possibleRef;
}

export function belowScreenPosition<T extends Layout>(
  view: View2D,
  node: T | Reference<T>,
): Vector2 {
  const n = unref(node);
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
