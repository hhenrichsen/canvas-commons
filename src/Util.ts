import {Layout, View2D, Node} from '@motion-canvas/2d';
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

export function remap(
  fromIn: number,
  toIn: number,
  fromOut: number,
  toOut: number,
  value: number,
): number {
  return fromOut + (toOut - fromOut) * ((value - fromIn) / (toIn - fromIn));
}

export function clamp(min: number, max: number, value: number): number {
  return Math.min(max, Math.max(min, value));
}

export function clampRemap(
  fromIn: number,
  toIn: number,
  fromOut: number,
  toOut: number,
  value: number,
): number {
  return clamp(fromOut, toOut, remap(fromIn, toIn, fromOut, toOut, value));
}

export function signum(value: number): number {
  return value > 0 ? 1 : value < 0 ? -1 : 0;
}

export function deref<T extends Node>(ref: T | Reference<T>): T {
  return typeof ref == 'function' ? ref() : ref;
}
