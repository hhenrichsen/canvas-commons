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
} from '@motion-canvas/2d';
import {Reference, SignalValue} from '@motion-canvas/core';
import {Colors} from '../Colors';
import {Scrollable, ScrollableProps} from './Scrollable';

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
        shadowColor={
          this.windowStyle == WindowStyle.MacOS
            ? Colors.Tailwind.Slate['950']
            : undefined
        }
        shadowOffset={{x: 4, y: 4}}
        shadowBlur={8}
        padding={this.windowStyle == WindowStyle.Windows98 ? 8 : 0}
        stroke={this.windowStyle == WindowStyle.MacOS ? undefined : 'white'}
        lineWidth={2}
      >
        <Scrollable
          ref={props.scrollable}
          orientation={props.orientation}
          inactiveOpacity={props.inactiveOpacity}
          padding={10}
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
              <Rect
                layout
                alignItems={'center'}
                justifyContent={'center'}
                size={30}
                fill={Colors.Tailwind.Slate['400']}
                stroke={'white'}
                marginRight={2}
                lineWidth={2}
                shadowColor={Colors.Tailwind.Slate['950']}
                shadowOffset={2}
              >
                <Icon
                  size={25}
                  color="black"
                  icon={'material-symbols:minimize'}
                />
              </Rect>
              <Rect
                layout
                alignItems={'center'}
                justifyContent={'center'}
                size={30}
                fill={Colors.Tailwind.Slate['400']}
                marginRight={10}
                stroke={'white'}
                lineWidth={2}
                shadowColor={Colors.Tailwind.Slate['950']}
                shadowOffset={2}
              >
                <Icon
                  size={25}
                  color="black"
                  icon={'material-symbols:chrome-maximize-outline-sharp'}
                />
              </Rect>
              <Rect
                layout
                alignItems={'center'}
                justifyContent={'center'}
                size={30}
                fill={Colors.Tailwind.Slate['400']}
                stroke={'white'}
                lineWidth={2}
                shadowColor={Colors.Tailwind.Slate['950']}
                shadowOffset={2}
              >
                <Icon size={25} color="black" icon={'material-symbols:close'} />
              </Rect>
            </Rect>
          ) : null}
        </Rect>
      </Rect>,
    );
  }
}
