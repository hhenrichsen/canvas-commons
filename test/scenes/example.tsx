import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {waitFor, waitUntil} from '@motion-canvas/core/lib/flow';
import {
  Circle,
  Code,
  Gradient,
  Knot,
  Layout,
  LezerHighlighter,
  Rect,
  Spline,
  Txt,
} from '@motion-canvas/2d';
import {createRef, linear, range, useRandom} from '@motion-canvas/core';
import {Scrollable} from '@components/Scrollable';
import {WindowStyle, Window} from '@components/Window';
import {Colors} from '@Colors';
import {DistortedCurve} from '@components/DistortedCurve';
import {drawIn} from '@Util';
import {parser as javascript} from '@lezer/javascript';
import {CatppuccinMochaHighlightStyle} from '@highlightstyle/Catppuccin';
import {CodeLineNumbers} from '@components/CodeLineNumbers';
import {Terminal} from '@components/Terminal';
import {Table, TableData, TableRow} from '@components/Table';
import {Plot, LinePlot, ScatterPlot} from '@index';

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
          new LezerHighlighter(javascript, CatppuccinMochaHighlightStyle)
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
  const terminalWindow = createRef<Window>();
  yield view.add(
    <Window
      ref={terminalWindow}
      title={'Terminal'}
      size={[1200, 800]}
      headerColor={Colors.Catppuccin.Mocha.Base}
      bodyColor={Colors.Catppuccin.Mocha.Mantle}
      buttonColors={[
        Colors.Catppuccin.Mocha.Red,
        Colors.Catppuccin.Mocha.Yellow,
        Colors.Catppuccin.Mocha.Green,
      ]}
      icon={'ph:terminal'}
    >
      <Terminal
        ref={terminal}
        defaultTxtProps={{fontFamily: 'Ellograph CF', fontSize: 90}}
        padding={20}
      />
      ,
    </Window>,
  );
  scrollable().fill(Colors.Catppuccin.Mocha.Mantle);
  yield* terminalWindow().open(view, 1);

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
  yield* terminalWindow().close(view, 1);

  const table = createRef<Table>();
  view.add(
    <Table lineWidth={2} ref={table} opacity={0}>
      <TableRow>
        <TableData>
          <Txt fill={'white'} width={'100%'} textAlign={'center'}>
            1
          </Txt>
        </TableData>
        <TableData>
          <Txt fill={'white'} width={'100%'} textAlign={'center'}>
            2
          </Txt>
        </TableData>
        <TableData>
          <Txt fill={'white'} width={'100%'} textAlign={'center'}>
            3
          </Txt>
        </TableData>
      </TableRow>
      <TableRow>
        <TableData>
          <Txt fill={'white'} width={'100%'} textAlign={'center'}>
            asdfghjkl;
          </Txt>
        </TableData>
        <TableData>
          <Txt fill={'white'} width={'100%'} textAlign={'center'}>
            2
          </Txt>
        </TableData>
        <TableData>
          <Circle size={50} fill={Colors.Catppuccin.Mocha.Blue}></Circle>
        </TableData>
      </TableRow>
    </Table>,
  );

  yield* table().opacity(1, 1);
  yield* waitFor(1);
  yield* table().opacity(0, 1);

  const random = useRandom();

  const plot = createRef<Plot>();
  view.add(
    <Plot
      size={500}
      ref={plot}
      labelX="Time"
      labelY="Beans"
      labelSize={10}
      opacity={0}
    >
      <LinePlot
        lineWidth={4}
        stroke={'red'}
        data={range(0, 26).map(i => [i * 4, random.nextInt(0, 100)])}
      />
      ,
    </Plot>,
  );

  yield* plot().opacity(1, 2);
  yield* waitFor(2);

  yield* plot().ticks(20, 3);
  yield* plot().tickLabelSize(20, 2);
  yield* plot().size(800, 2);
  yield* plot().labelSize(30, 2);
  yield* plot().min(-100, 2);
  yield* plot().opacity(0, 2);
  plot().remove();

  const plot2 = createRef<Plot>();
  const line2 = createRef<LinePlot>();
  view.add(
    <Plot
      clip
      size={500}
      ref={plot2}
      labelSize={0}
      min={[-Math.PI * 2, -2]}
      max={[Math.PI * 2, 2]}
      labelFormatterX={x => `${Math.round(x / Math.PI)}π`}
      ticks={[4, 4]}
      opacity={0}
    >
      <LinePlot lineWidth={4} stroke={'red'} end={0} ref={line2} />
    </Plot>,
  );

  line2().data(plot2().makeGraphData(0.1, x => Math.sin(x)));

  yield* plot2().opacity(1, 2);
  yield* waitFor(2);
  yield* line2().end(1, 1);
  yield* waitFor(3);

  yield* plot2().opacity(0, 2);

  const plot3 = createRef<Plot>();
  const scatter3 = createRef<ScatterPlot>();
  view.add(
    <Plot
      size={500}
      ref={plot3}
      labelX="Time"
      labelY="Errors"
      labelSize={10}
      opacity={0}
    >
      <ScatterPlot
        pointRadius={5}
        pointColor={'red'}
        ref={scatter3}
        start={0.5}
        end={0.5}
        data={range(0, 26).map(i => [i * 4, random.nextInt(0, 100)])}
      />
    </Plot>,
  );

  yield* plot3().opacity(1, 2);
  yield* waitFor(2);
  yield scatter3().end(1, 3, linear);
  yield* waitFor(0.1);
  yield* scatter3().start(0, 3, linear);
  yield* waitFor(2);
  yield* plot3().opacity(0, 2);

  const plot4 = createRef<Plot>();
  const line4 = createRef<LinePlot>();
  view.add(
    <Plot
      clip
      size={500}
      ref={plot4}
      labelSize={0}
      minX={-10}
      maxX={10}
      minY={-2}
      maxY={50}
      opacity={0}
      ticks={[4, 4]}
      offset={[-1, 0]}
    >
      <LinePlot lineWidth={4} stroke={'red'} ref={line4} />
    </Plot>,
  );

  line4().data(plot4().makeGraphData(0.1, x => Math.pow(x, 2)));
  yield* plot4().opacity(1, 2);
  yield* waitFor(2);
  yield* line4().end(1, 1);

  yield* waitFor(5);
});
