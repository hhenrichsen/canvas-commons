import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {waitFor, waitUntil} from '@motion-canvas/core/lib/flow';
import {Gradient, Knot, Rect, Spline} from '@motion-canvas/2d';
import {createRef} from '@motion-canvas/core';
import {Scrollable} from '@components/Scrollable';
import {WindowStyle, Window} from '@components/Window';
import {Colors} from '@Colors';
import {DistortedCurve} from '@components/DistortedCurve';

export default makeScene2D(function* (view) {
  const scrollable = createRef<Scrollable>();
  const r = createRef<Rect>();
  const spl = createRef<Spline>();
  view.add(
    <Window
      windowStyle={WindowStyle.Windows98}
      scrollable={scrollable}
      size={[500, 550]}
      scrollPadding={8}
    >
      <Rect ref={r} size={600} radius={5}></Rect>
      <DistortedCurve
        curve={r}
        samples={100}
        count={2}
        displacement={5}
        lineProps={{
          stroke: new Gradient({
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
          }),
          fill: new Gradient({
            stops: [
              {
                color: Colors.Tailwind.Amber['600'] + '20',
                offset: 0,
              },
              {
                color: Colors.Tailwind.Amber['200'] + '20',
                offset: 1,
              },
            ],
            type: 'linear',
            from: [0, -600],
            to: [0, 600],
          }),
          lineWidth: 2,
        }}
      ></DistortedCurve>
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
        <Knot position={[500, 0]}></Knot>
      </Spline>
    </Window>,
  );

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
