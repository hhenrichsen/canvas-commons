import {Colors} from '@Colors';
import {
  Layout,
  Rect,
  Txt,
  TxtProps,
  computed,
  initial,
  signal,
  Node,
} from '@motion-canvas/2d';
import {
  SignalValue,
  SimpleSignal,
  createSignal,
  unwrap,
} from '@motion-canvas/core';
import {Scrollable} from './Scrollable';
import {WindowProps, Window} from './Window';

export interface TerminalProps extends WindowProps {
  prefix?: SignalValue<string | TxtProps>;
}

export class Terminal extends Window {
  private internalCanvas: CanvasRenderingContext2D = document
    .createElement('canvas')
    .getContext('2d');

  @initial('❯ ')
  @signal()
  public declare readonly prefix: SimpleSignal<string | TxtProps>;

  private lines: SimpleSignal<TxtProps[][]>;
  private cachedLines: SimpleSignal<Node[]>;

  @computed()
  private getLines(): Node[] {
    return this.lines()
      .slice(this.cachedLines().length)
      .map(fragments => {
        return (
          <Layout direction={'row'} width={this.size().x - 40}>
            {fragments.length ? (
              fragments.map(fragment => {
                const parentedDefaults = {
                  fill: Colors.Catppuccin.Mocha.Text,
                  fontWeight: this.fontWeight(),
                  fontFamily: this.fontFamily(),
                  fontSize: this.fontSize(),
                  ...fragment,
                };
                this.internalCanvas.font = `${unwrap(parentedDefaults.fontWeight) || 400} ${unwrap(parentedDefaults.fontSize)}px ${unwrap(parentedDefaults.fontFamily)}`;
                const spc = this.internalCanvas.measureText(' ');
                return unwrap(fragment.text)
                  .split(/( )/g)
                  .filter(Boolean)
                  .map(spaceOrText => {
                    if (spaceOrText == ' ') {
                      return (
                        <Rect
                          width={spc.width}
                          height={
                            spc.fontBoundingBoxAscent +
                            spc.fontBoundingBoxDescent
                          }
                        />
                      );
                    }
                    return (
                      <Txt
                        fill={Colors.Catppuccin.Mocha.Text}
                        {...parentedDefaults}
                        text={spaceOrText}
                      />
                    );
                  });
              })
            ) : (
              <Rect width={1} height={36} />
            )}
          </Layout>
        );
      });
  }

  public constructor(props: TerminalProps) {
    super({
      ...props,
    });
    this.cachedLines = createSignal([]);
    this.lines = createSignal([]);
    const scrollable: Scrollable = this.scrollable();

    scrollable.contents().children(() => (
      <Layout minHeight={this.size().y - 80} direction={'column'} layout>
        {[...this.cachedLines(), ...this.getLines()]}
      </Layout>
    ));
  }

  public lineAppear(line: string | TxtProps | TxtProps[]) {
    this.cachedLines([...this.cachedLines(), ...this.getLines()]);
    this.lines([...this.lines(), !line ? [] : this.makeProps(line)]);
  }

  public *typeLine(line: string | TxtProps, duration: number) {
    this.cachedLines([...this.cachedLines(), ...this.getLines()]);
    const l = createSignal('');
    const t = typeof line == 'string' ? line : line.text;
    const p = this.prefix();
    const props: TxtProps[] = [
      typeof p == 'string' ? {text: p} : p,
      typeof line == 'string'
        ? {
            text: l,
          }
        : {
            text: l,
            ...line,
          },
    ];
    const fixedProps = [
      typeof p == 'string' ? {text: p} : p,
      {
        ...props[0],
        text: t,
      },
    ];
    this.lines([...this.lines(), props]);
    yield* l(l() + t, duration);
    this.lines([...this.lines().slice(0, -1), fixedProps]);
  }

  public *typeAfterLine(line: string | TxtProps, duration: number) {
    this.cachedLines(this.cachedLines().slice(0, -1));
    const t = typeof line == 'string' ? line : line.text;
    const l = createSignal('');
    const lastLine = this.lines()[this.lines().length - 1];

    const props: TxtProps =
      typeof line == 'string'
        ? {
            text: l,
          }
        : {
            text: l,
            ...line,
          };
    const fixedProps = {
      ...props,
      text: t,
    };
    lastLine.push(props);
    this.lines([...this.lines().slice(0, -1), lastLine]);
    yield* l(t, duration);
    lastLine.pop();
    lastLine.push(fixedProps);
    this.lines([...this.lines().slice(0, -1), lastLine]);
  }

  public appearAfterLine(line: string | TxtProps) {
    this.cachedLines(this.cachedLines().slice(0, -1));
    const lastLine = this.lines()[this.lines().length - 1];

    lastLine.push(...this.makeProps(line));
    this.lines([...this.lines().slice(0, -1), lastLine]);
  }

  public replaceLine(newLine: string | TxtProps | TxtProps[]) {
    this.cachedLines(this.cachedLines().slice(0, -1));
    this.lines([...this.lines().slice(0, -1), this.makeProps(newLine)]);
  }

  public deleteLine() {
    this.cachedLines(this.cachedLines().slice(0, -1));
    this.lines([...this.lines().slice(0, -1)]);
  }

  private makeProps(line: string | TxtProps | TxtProps[]) {
    return Array.isArray(line)
      ? line
      : [typeof line == 'string' ? {text: line} : line];
  }
}
