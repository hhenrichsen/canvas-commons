import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {waitFor} from '@motion-canvas/core/lib/flow';
import {Icon, Rect} from '@motion-canvas/2d';
import {createRef} from '@motion-canvas/core';
import {Windows98Button} from '@components/WindowsButton';
import {Scrollable} from '@components/Scrollable';
import {WindowStyle, Window} from '@components/Window';
import {Colors} from '@Colors';

export default makeScene2D(function* (view) {
  const scrollable = createRef<Scrollable>();
  view.add(
    <>
      <Window windowStyle={WindowStyle.Windows98} scrollable={scrollable}>
        <Rect
          x={500}
          y={2000}
          size={40}
          fill={Colors.Tailwind.Amber['500']}
          radius={5}
        ></Rect>
      </Window>
      <Windows98Button borderSize={8}>
        <Icon
          height={100}
          width={100}
          icon={'ph:activity-bold'}
          color="white"
        />
      </Windows98Button>
      ,
    </>,
  );

  yield* scrollable().scrollTo([500, 2000], 2);
  yield* waitFor(5);
});
