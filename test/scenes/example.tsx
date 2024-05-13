import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {waitFor, waitUntil} from '@motion-canvas/core/lib/flow';
import {
  Code,
  Gradient,
  Knot,
  Layout,
  LezerHighlighter,
  Rect,
  Spline,
} from '@motion-canvas/2d';
import {createRef} from '@motion-canvas/core';
import {Scrollable} from '@components/Scrollable';
import {WindowStyle, Window} from '@components/Window';
import {Colors} from '@Colors';
import {DistortedCurve} from '@components/DistortedCurve';
import {drawIn} from '@Util';
import {parser as javascript} from '@lezer/javascript';
import {CatppuccinMochHighlightStyle} from '@highlightstyle/Catppuccin';
import {CodeLineNumbers} from '@components/CodeLineNumbers';

export default makeScene2D(function* (view) {
  const code = createRef<Code>();
  const codeContainer = createRef<Layout>();
  view.add(
    <Layout layout direction={'row'} gap={20} opacity={0} ref={codeContainer}>
      <CodeLineNumbers
        code={code}
        numberProps={{
          fill: Colors.Catppuccin.Mocha.Overlay2,
        }}
      ></CodeLineNumbers>
      <Code
        ref={code}
        highlighter={
          new LezerHighlighter(javascript, CatppuccinMochHighlightStyle)
        }
        code={`\
const btn = document.getElementById('btn');
let count = 0;

function render() {
  btn.innerHTML = \`Count: \${count}\`;
}

btn.addEventListener('click', () => {
  if (count < 10) {
    count++;
    render();
  }
});

class Cat {
  constructor(name) {
    this.name = name ?? 'Mochi';
  }

  meow() {
    console.log(\`Meow! I'm \${this.name}\`);
  }
}`}
        fontSize={30}
      />
    </Layout>,
  );
  yield* codeContainer().opacity(1, 1);
  yield* waitFor(1);
  yield* code().code.append('\n// This is a comment', 1);
  yield* waitFor(1);
  yield* codeContainer().opacity(0, 1);
  code().remove();

  const draw = createRef<Rect>();
  view.add(
    <Rect
      radius={5}
      size={200}
      ref={draw}
      lineCap={'round'}
      strokeFirst
    ></Rect>,
  );

  yield* drawIn(draw, 'white', 'white', 1, true);

  yield* waitFor(1);
  yield* draw().opacity(0, 1);
  yield* waitFor(1);

  const scrollable = createRef<Scrollable>();
  const r = createRef<Rect>();
  const spl = createRef<Spline>();
  const win = createRef<Window>();
  view.add(
    <Window
      ref={win}
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
  yield* win().open(view, 1);

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
