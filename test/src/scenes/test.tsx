import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {waitFor} from '@motion-canvas/core/lib/flow';
import {Colors, Scrollable, Window, WindowStyle} from '@components/index';
import {Rect} from '@motion-canvas/2d';
import {createRef} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const scrollable = createRef<Scrollable>();
  // Create your animations here
  view.add(
    <Window windowStyle={WindowStyle.Windows98} scrollable={scrollable}>
      <Rect
        x={500}
        y={2000}
        size={40}
        fill={Colors.Tailwind.Amber['500']}
        radius={5}
      ></Rect>
    </Window>,
  );

  yield* scrollable().scrollTo([500, 2000], 2);
  yield* waitFor(5);
});
