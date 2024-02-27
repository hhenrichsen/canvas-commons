import {Layout, View2D} from '@motion-canvas/2d';
import {Reference, Vector2} from '@motion-canvas/core';

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
    y: view.size().y / 2 + n.height(),
  });
}
