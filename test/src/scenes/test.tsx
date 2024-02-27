import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {waitFor} from '@motion-canvas/core/lib/flow';
import {Switch} from '@components/SwitchComponent';

export default makeScene2D(function* (view) {
  // Create your animations here
  view.add(<Switch />);
  yield* waitFor(5);
});
