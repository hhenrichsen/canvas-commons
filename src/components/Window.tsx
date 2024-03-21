import {
  Rect,
  Circle,
  Txt,
  TxtProps,
  Icon,
  Gradient,
  initial,
  PossibleCanvasStyle,
  CanvasStyleSignal,
  canvasStyleSignal,
  nodeName,
  View2D,
} from '@motion-canvas/2d';
import {PossibleVector2, Reference, SignalValue} from '@motion-canvas/core';
import {Colors} from '../Colors';
import {Scrollable, ScrollableProps} from './Scrollable';
import {belowScreenPosition} from '../Util';
import {Windows98Button} from './WindowsButton';

export enum WindowStyle {
  MacOS,
  Windows98,
}

export interface WindowProps extends ScrollableProps {
  title?: SignalValue<string>;
  titleProps?: TxtProps;
  headerColor?: SignalValue<PossibleCanvasStyle>;
  bodyColor?: SignalValue<PossibleCanvasStyle>;
  windowStyle?: WindowStyle;
  scrollable?: Reference<Scrollable>;
  scrollOffset?: SignalValue<PossibleVector2>;
}

@nodeName('Window')
export class Window extends Rect {
  public declare readonly title: SignalValue<string>;

  public declare readonly titleProps: TxtProps;

  @initial(Colors.Tailwind.Slate['700'])
  @canvasStyleSignal()
  public declare readonly headerColor: CanvasStyleSignal<this>;

  @initial(Colors.Tailwind.Slate['800'])
  @canvasStyleSignal()
  public declare readonly bodyColor: CanvasStyleSignal<this>;

  public declare readonly windowStyle: WindowStyle;

  public constructor(props: WindowProps) {
    super({
      size: 400,
      ...props,
    });
    this.windowStyle = props.windowStyle ?? WindowStyle.MacOS;
    if (!props.headerColor && this.windowStyle == WindowStyle.Windows98) {
      this.headerColor(
        () =>
          new Gradient({
            stops: [
              {color: '#111179', offset: 0},
              {color: '#0481CF', offset: 1},
            ],
            type: 'linear',
            from: {x: 0, y: 0},
            to: {
              x: this.size.x(),
              y: 0,
            },
          }),
      );
    }

    this.add(
      <Rect
        layout
        clip
        direction={'column-reverse'}
        fill={Colors.Tailwind.Slate['800']}
        radius={this.windowStyle === WindowStyle.MacOS ? 16 : 0}
        size={this.size}
        shadowColor={Colors.Tailwind.Slate['950'] + '80'}
        shadowOffset={this.windowStyle == WindowStyle.MacOS ? 4 : 20}
        shadowBlur={this.windowStyle == WindowStyle.MacOS ? 8 : 0}
        padding={this.windowStyle == WindowStyle.Windows98 ? 8 : 0}
        stroke={this.windowStyle == WindowStyle.MacOS ? undefined : 'white'}
        lineWidth={2}
      >
        <Scrollable
          activeOpacity={props.activeOpacity}
          handleInset={props.handleInset}
          handleProps={props.handleProps}
          handleWidth={props.handleWidth}
          inactiveOpacity={props.inactiveOpacity}
          ref={props.scrollable}
          scrollOffset={props.scrollOffset}
          scrollPadding={props.scrollPadding}
          size={() =>
            this.size()
              .addY(-50)
              .add(
                this.windowStyle == WindowStyle.Windows98
                  ? {x: -16, y: -16}
                  : {x: 0, y: 0},
              )
          }
        >
          {props.children}
        </Scrollable>
        <Rect
          layout
          justifyContent={'space-between'}
          alignItems={'center'}
          fill={this.headerColor}
          padding={10}
          height={50}
          stroke={this.windowStyle == WindowStyle.MacOS ? undefined : 'white'}
          lineWidth={2}
          shadowColor={Colors.Tailwind.Slate['950']}
          shadowOffset={2}
        >
          <Rect>
            <Txt
              fill={Colors.Tailwind.Slate['50']}
              fontSize={30}
              text={props.title}
              {...props.titleProps}
            ></Txt>
          </Rect>
          {this.windowStyle == WindowStyle.MacOS ? (
            <Rect gap={10}>
              <Circle size={20} fill={Colors.Tailwind.Red['500']}></Circle>
              <Circle size={20} fill={Colors.Tailwind.Yellow['500']}></Circle>
              <Circle size={20} fill={Colors.Tailwind.Green['500']}></Circle>
            </Rect>
          ) : null}
          {this.windowStyle == WindowStyle.Windows98 ? (
            <Rect>
              <Windows98Button borderSize={2}>
                <Icon
                  size={24}
                  color="black"
                  icon={'material-symbols:minimize'}
                />
              </Windows98Button>
              <Windows98Button borderSize={2} marginRight={10}>
                <Icon
                  size={24}
                  color="black"
                  icon={'material-symbols:chrome-maximize-outline-sharp'}
                />
              </Windows98Button>
              <Windows98Button borderSize={2}>
                <Icon size={24} color="black" icon={'material-symbols:close'} />
              </Windows98Button>
            </Rect>
          ) : null}
        </Rect>
      </Rect>,
    );
  }

  public *close(view: View2D, duration: number) {
    yield this.scale(0, duration);
    yield* this.position(belowScreenPosition(view, this), duration);
  }

  public *open(view: View2D, duration: number) {
    const oldPosition = this.position();
    const oldScale = this.scale();
    this.position(belowScreenPosition(view, this));
    this.scale(0);
    yield this.scale(oldScale, duration);
    yield* this.position(oldPosition, duration);
  }
}
