import {
  Rect,
  ComponentChildren,
  RectProps,
  Line,
  PossibleCanvasStyle,
} from '@motion-canvas/2d';
import {Colors} from '../Colors';
import {
  SignalValue,
  createComputed,
  createRef,
  createSignal,
  unwrap,
} from '@motion-canvas/core';

export const Windows98Button = ({
  lightColor = Colors.Tailwind.Slate['950'],
  darkColor = Colors.Tailwind.Slate['400'],
  ...props
}: RectProps & {
  children?: SignalValue<ComponentChildren>;
  borderSize?: SignalValue<number>;
  lightColor?: SignalValue<PossibleCanvasStyle>;
  darkColor?: SignalValue<PossibleCanvasStyle>;
}) => {
  const borderSize = createComputed(() => unwrap(props.borderSize) ?? 4);
  const content = createRef<Rect>();
  const container = createSignal<Rect>();
  const nonChildProps = {...props};
  delete nonChildProps.children;
  return (
    <Rect
      alignItems={'center'}
      fill={Colors.Tailwind.Slate['400']}
      justifyContent={'center'}
      layout
      lineWidth={borderSize() * 2}
      ref={container}
      stroke={lightColor}
      {...nonChildProps}
      margin={borderSize()}
    >
      <Rect
        fill={darkColor}
        layout={false}
        size={() => content()?.size().add(borderSize()) ?? 0}
        x={() => borderSize() / 2}
        y={() => borderSize() / 2}
      />
      <Line
        layout={false}
        points={() => {
          const tr = content()?.topRight();
          return tr
            ? [tr, tr.addX(borderSize()), tr.add([borderSize(), -borderSize()])]
            : [];
        }}
        fill={darkColor}
      ></Line>
      <Line
        layout={false}
        points={() => {
          const bl = content()?.bottomLeft();
          return bl
            ? [bl, bl.add([-borderSize(), borderSize()]), bl.addY(borderSize())]
            : [];
        }}
        fill={darkColor}
      ></Line>
      <Rect
        alignItems={'center'}
        fill={nonChildProps.fill}
        justifyContent={'center'}
        layout
        minHeight={24}
        minWidth={24}
        ref={content}
      >
        {props.children}
      </Rect>
    </Rect>
  );
};
