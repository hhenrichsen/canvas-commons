import {
  LoopCallback,
  PlaybackState,
  ThreadGenerator,
  beginSlide,
  cancel,
  loop,
  usePlayback,
} from '@motion-canvas/core';

export function* loopSlide(
  name: string,
  setup: undefined | (() => ThreadGenerator),
  frame: (() => ThreadGenerator) | LoopCallback,
  cleanup: undefined | (() => ThreadGenerator),
): ThreadGenerator {
  if (usePlayback().state !== PlaybackState.Presenting) {
    if (setup) yield* setup();
    // Run the loop once if it's in preview mode
    // @ts-ignore
    yield* frame(0);
    yield* beginSlide(name);
    if (cleanup) yield* cleanup();
    return;
  }
  if (setup) yield* setup();
  const task = yield loop(Infinity, frame);
  yield* beginSlide(name);
  if (cleanup) yield* cleanup();
  cancel(task);
}
