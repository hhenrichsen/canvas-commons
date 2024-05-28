import {Colors} from '@Colors';
import {belowScreenPosition} from '@Util';
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
  signal,
  withDefaults,
} from '@motion-canvas/2d';
import {
  PossibleColor,
  PossibleVector2,
  Reference,
  SignalValue,
  SimpleSignal,
  createRef,
} from '@motion-canvas/core';
import {ScrollableProps, Scrollable} from './Scrollable';
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
  buttonColors?: SignalValue<
    [PossibleCanvasStyle, PossibleCanvasStyle, PossibleCanvasStyle]
  >;
  buttonIconColors?: SignalValue<
    [PossibleCanvasStyle, PossibleCanvasStyle, PossibleCanvasStyle]
  >;
  buttonLightColor?: SignalValue<PossibleCanvasStyle>;
  buttonDarkColor?: SignalValue<PossibleCanvasStyle>;
}

@nodeName('Window')
export class Window extends Rect {
  @signal()
  public declare readonly title: SimpleSignal<string, this>;

  @signal()
  public declare readonly titleProps: SimpleSignal<TxtProps, this>;

  @initial(Colors.Tailwind.Slate['700'])
  @canvasStyleSignal()
  public declare readonly headerColor: CanvasStyleSignal<this>;

  @initial(Colors.Tailwind.Slate['800'])
  @canvasStyleSignal()
  public declare readonly bodyColor: CanvasStyleSignal<this>;

  @signal()
  public declare readonly buttonColors: SimpleSignal<
    [PossibleCanvasStyle, PossibleCanvasStyle, PossibleCanvasStyle],
    this
  >;

  @initial(['black', 'black', 'black'])
  @signal()
  public declare readonly buttonIconColors: SimpleSignal<
    [PossibleColor, PossibleColor, PossibleColor],
    this
  >;

  public declare readonly windowStyle: WindowStyle;

  @initial('white')
  @canvasStyleSignal()
  public declare readonly buttonLightColor: CanvasStyleSignal<this>;

  @initial(Colors.Tailwind.Slate['950'])
  @canvasStyleSignal()
  public declare readonly buttonDarkColor: CanvasStyleSignal<this>;

  public readonly scrollable: Reference<Scrollable>;

  public constructor(props: WindowProps) {
    super({
      size: 400,
      stroke: 'white',
      ...props,
    });
    this.windowStyle = props.windowStyle ?? WindowStyle.MacOS;
    this.scrollable = props.scrollable ?? createRef<Scrollable>();
    if (!props.buttonColors) {
      this.buttonColors(
        this.windowStyle == WindowStyle.MacOS
          ? [
              Colors.Tailwind.Red['500'],
              Colors.Tailwind.Yellow['500'],
              Colors.Tailwind.Green['500'],
            ]
          : [
              Colors.Tailwind.Slate['400'],
              Colors.Tailwind.Slate['400'],
              Colors.Tailwind.Slate['400'],
            ],
      );
    }
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
        fill={this.bodyColor}
        radius={this.windowStyle === WindowStyle.MacOS ? 16 : 0}
        size={this.size}
        shadowColor={Colors.Tailwind.Slate['950'] + '80'}
        shadowOffset={this.windowStyle == WindowStyle.MacOS ? 4 : 20}
        shadowBlur={this.windowStyle == WindowStyle.MacOS ? 8 : 0}
        padding={this.windowStyle == WindowStyle.Windows98 ? 8 : 0}
        stroke={this.windowStyle == WindowStyle.MacOS ? undefined : this.stroke}
        lineWidth={2}
      >
        <Scrollable
          activeOpacity={props.activeOpacity}
          handleInset={props.handleInset}
          handleProps={props.handleProps}
          handleWidth={props.handleWidth}
          inactiveOpacity={props.inactiveOpacity}
          ref={this.scrollable}
          scrollHandleDelay={props.scrollHandleDelay}
          scrollHandleDuration={props.scrollHandleDuration}
          scrollOffset={props.scrollOffset}
          scrollPadding={props.scrollPadding}
          fill={this.bodyColor}
          zoom={props.zoom}
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
          stroke={
            this.windowStyle == WindowStyle.MacOS ? undefined : this.stroke
          }
          lineWidth={2}
          shadowColor={Colors.Tailwind.Slate['950']}
          shadowOffset={2}
        >
          <Rect>
            <Txt
              fill={Colors.Tailwind.Slate['50']}
              fontSize={30}
              {...props.titleProps}
              text={props.title}
            ></Txt>
          </Rect>
          {this.windowStyle == WindowStyle.MacOS ? (
            <Rect gap={10}>
              <Circle size={20} fill={() => this.buttonColors()[0]}></Circle>
              <Circle size={20} fill={() => this.buttonColors()[1]}></Circle>
              <Circle size={20} fill={() => this.buttonColors()[2]}></Circle>
            </Rect>
          ) : null}
          {this.windowStyle == WindowStyle.Windows98 ? (
            <Rect>
              <Windows98Button
                borderSize={2}
                lightColor={this.buttonLightColor}
                darkColor={this.buttonDarkColor}
                fill={() => this.buttonColors()[0]}
              >
                <Icon
                  size={24}
                  color={() => this.buttonIconColors()[0]}
                  icon={'material-symbols:minimize'}
                />
              </Windows98Button>
              <Windows98Button
                borderSize={2}
                marginRight={10}
                lightColor={this.buttonLightColor}
                darkColor={this.buttonDarkColor}
                fill={() => this.buttonColors()[1]}
              >
                <Icon
                  size={24}
                  color={() => this.buttonIconColors()[1]}
                  icon={'material-symbols:chrome-maximize-outline-sharp'}
                />
              </Windows98Button>
              <Windows98Button
                borderSize={2}
                lightColor={this.buttonLightColor}
                darkColor={this.buttonDarkColor}
                fill={() => this.buttonColors()[2]}
              >
                <Icon
                  size={24}
                  color={() => this.buttonIconColors()[2]}
                  icon={'material-symbols:close'}
                />
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

export const Windows98Window = withDefaults(Window, {
  windowStyle: WindowStyle.Windows98,
});

export const MacOSWindow = withDefaults(Window, {
  windowStyle: WindowStyle.MacOS,
});
