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
  setup: () => ThreadGenerator,
  frame: (() => ThreadGenerator) | LoopCallback,
  cleanup: () => ThreadGenerator,
): ThreadGenerator {
  if (usePlayback().state !== PlaybackState.Presenting) {
    yield* setup();
    // Run the loop once if it's in preview mode
    // @ts-ignore
    yield* frame(0);
    yield* beginSlide(name);
    yield* cleanup();
    return;
  }
  yield* setup();
  const task = yield loop(Infinity, frame);
  yield* beginSlide(name);
  yield* cleanup();
  cancel(task);
}
