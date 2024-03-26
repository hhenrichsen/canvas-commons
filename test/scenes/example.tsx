import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {waitFor, waitUntil} from '@motion-canvas/core/lib/flow';
import {Gradient, Icon, Knot, Rect, Spline} from '@motion-canvas/2d';
import {createRef} from '@motion-canvas/core';
import {Windows98Button} from '@components/WindowsButton';
import {Scrollable} from '@components/Scrollable';
import {WindowStyle, Window} from '@components/Window';
import {Colors} from '@Colors';

export default makeScene2D(function* (view) {
  const scrollable = createRef<Scrollable>();
  const r = createRef<Rect>();
  const spl = createRef<Spline>();
  view.add(
    <>
      <Window
        windowStyle={WindowStyle.Windows98}
        scrollable={scrollable}
        size={[500, 550]}
        scrollPadding={8}
      >
        <Rect
          ref={r}
          size={[100, 600]}
          fill={
            new Gradient({
              stops: [
                {
                  color: Colors.Tailwind.Amber['600'],
                  offset: 0,
                },
                {
                  color: Colors.Tailwind.Amber['200'],
                  offset: 1,
                },
              ],
              type: 'linear',
              from: [0, -600],
              to: [0, 600],
            })
          }
          radius={5}
        ></Rect>
        <Rect
          size={[100, 100]}
          position={[0, 500]}
          fill={Colors.Tailwind.Amber['600']}
          radius={5}
        ></Rect>
        <Rect
          size={[100, 100]}
          position={[0, -500]}
          fill={Colors.Tailwind.Amber['600']}
          radius={5}
        ></Rect>
        <Rect
          size={[100, 100]}
          position={[500, 0]}
          fill={Colors.Tailwind.Amber['600']}
          radius={5}
        ></Rect>
        <Rect
          size={[100, 100]}
          position={[-500, 0]}
          fill={Colors.Tailwind.Amber['600']}
          radius={5}
        ></Rect>
        <Spline ref={spl}>
          <Knot position={[500, 0]}></Knot>
          <Knot position={[0, 500]}></Knot>
          <Knot position={[-500, 0]}></Knot>
          <Knot position={[0, -500]}></Knot>
        </Spline>
      </Window>
      <Windows98Button borderSize={8} position={[300, 0]}>
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

  yield* r().width(600, 1);
  yield* scrollable().scrollToTop(1);
  yield* waitFor(1);
  yield* scrollable().scrollToRight(1);
  yield* waitFor(1);
  yield* scrollable().scrollToTopCenter(1);
  yield* waitFor(1);
  yield* scrollable().scrollToRightCenter(1);
  yield* waitFor(1);
  yield* scrollable().scrollToBottom(1);
  yield* waitFor(1);
  yield* scrollable().scrollToLeft(1);
  yield* waitFor(1);
  yield* scrollable().scrollToBottomCenter(1);
  yield* waitFor(1);
  yield* scrollable().scrollToLeftCenter(1);
  yield* waitFor(1);

  yield* scrollable().scrollToTopLeft(1);
  yield* waitFor(1);
  yield* scrollable().scrollToTopRight(1);
  yield* waitFor(1);
  yield* scrollable().scrollToBottomRight(1);
  yield* waitFor(1);
  yield* scrollable().scrollToBottomLeft(1);

  yield* waitUntil('spline follow');
  yield* scrollable().scrollTo(spl().getPointAtPercentage(0).position, 1);
  yield* scrollable().followCurve(spl(), 5);

  yield* waitUntil('zoomed out');
  yield* waitFor(1);
  yield* scrollable().zoom(0.5, 1);
  yield* waitFor(1);
  yield* scrollable().scrollToRightCenter(1);
  yield* waitFor(1);
  yield* scrollable().scrollToBottomCenter(1);
  yield* waitFor(1);
  yield* scrollable().scrollToLeftCenter(1);
  yield* waitFor(1);
  yield* scrollable().scrollToTopCenter(1);
  yield* waitFor(1);
  yield* scrollable().scrollToCenter(1);
  yield* waitFor(1);

  yield* waitUntil('zoomed in');

  yield* scrollable().zoom(2, 1);
  yield* waitFor(1);
  yield* scrollable().scrollToRightCenter(1);
  yield* waitFor(1);
  yield* scrollable().scrollToBottomCenter(1);
  yield* waitFor(1);
  yield* scrollable().scrollToLeftCenter(1);
  yield* waitFor(1);
  yield* scrollable().scrollToTopCenter(1);
  yield* waitFor(1);
  yield* scrollable().scrollToCenter(1);
  yield* waitFor(1);
});
