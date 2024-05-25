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
import {Terminal} from '@components/Terminal';

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

  yield* win().close(view, 1);

  const terminal = createRef<Terminal>();
  yield view.add(
    <Terminal
      ref={terminal}
      size={[1200, 800]}
      headerColor={Colors.Catppuccin.Mocha.Base}
      bodyColor={Colors.Catppuccin.Mocha.Mantle}
      fontFamily={'Ellograph CF'}
      fontSize={32}
      buttonColors={[
        Colors.Catppuccin.Mocha.Red,
        Colors.Catppuccin.Mocha.Yellow,
        Colors.Catppuccin.Mocha.Green,
      ]}
      title={'Terminal'}
    />,
  );
  scrollable().fill(Colors.Catppuccin.Mocha.Mantle);
  yield* terminal().open(view, 1);

  yield* terminal().typeLine('npm init @motion-canvas@latest', 2);
  yield* waitFor(1);
  terminal().lineAppear('');
  terminal().lineAppear('Need to install the following packages:');
  terminal().lineAppear('  @motion-canvas/create');
  terminal().lineAppear('Ok to proceed? (y)');
  yield* waitFor(1);
  yield* terminal().typeAfterLine(' y', 1);
  terminal().lineAppear([
    {text: '? Project name '},
    {text: '»', fill: Colors.Catppuccin.Mocha.Surface2},
  ]);
  yield* waitFor(1);
  yield* terminal().typeAfterLine(' my-animation', 1);
  yield* waitFor(1);
  terminal().replaceLine([
    {text: '√', fill: Colors.Catppuccin.Mocha.Green},
    {text: ' Project name '},
    {text: '...', fill: Colors.Catppuccin.Mocha.Surface2},
    {text: ' my-animation'},
  ]);
  terminal().lineAppear([
    {text: '? Project path '},
    {text: '»', fill: Colors.Catppuccin.Mocha.Surface2},
  ]);
  yield* terminal().typeAfterLine(' my-animation', 1);
  yield* waitFor(1);
  terminal().replaceLine([
    {text: '√', fill: Colors.Catppuccin.Mocha.Green},
    {text: ' Project path '},
    {text: '...', fill: Colors.Catppuccin.Mocha.Surface2},
    {text: ' my-animation'},
  ]);
  terminal().lineAppear('? Language');
  terminal().appearAfterLine({
    text: ' » - Use arrow-keys. Return to submit.',
    fill: Colors.Catppuccin.Mocha.Surface2,
  });
  terminal().lineAppear({
    text: '>   TypeScript (Recommended)',
    fill: Colors.Catppuccin.Mocha.Sky,
  });
  terminal().lineAppear('    JavaScript');
  yield* waitFor(3);

  terminal().deleteLine();
  terminal().deleteLine();
  terminal().replaceLine([
    {text: '√', fill: Colors.Catppuccin.Mocha.Green},
    {text: ' Language '},
    {text: '...', fill: Colors.Catppuccin.Mocha.Surface2},
    {text: 'TypeScript (Recommended)'},
  ]);
  terminal().lineAppear('');

  terminal().lineAppear({
    text: '√ Scaffolding complete. You can now run:',
    fill: Colors.Catppuccin.Mocha.Green,
  });
  terminal().lineAppear({
    text: '    cd my-animation',
  });
  terminal().lineAppear({
    text: '    npm install',
  });
  terminal().lineAppear({
    text: '    npm start',
  });

  yield* waitFor(2);
  yield* terminal().close(view, 1);
});
