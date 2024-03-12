import {Rect, ComponentChildren, RectProps, Line} from '@motion-canvas/2d';
import {Colors} from '../Colors';
import {
  SignalValue,
  createComputed,
  createRef,
  createSignal,
  unwrap,
} from '@motion-canvas/core';

export const Windows98Button = (
  props: RectProps & {
    children?: SignalValue<ComponentChildren>;
    borderSize?: SignalValue<number>;
  },
) => {
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
      stroke={'white'}
      {...nonChildProps}
      margin={borderSize()}
    >
      <Rect
        fill={Colors.Tailwind.Slate['950']}
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
        fill={Colors.Tailwind.Slate['950']}
      ></Line>
      <Line
        layout={false}
        points={() => {
          const bl = content()?.bottomLeft();
          return bl
            ? [bl, bl.add([-borderSize(), borderSize()]), bl.addY(borderSize())]
            : [];
        }}
        fill={Colors.Tailwind.Slate['950']}
      ></Line>
      <Rect
        alignItems={'center'}
        fill={Colors.Tailwind.Slate['400']}
        justifyContent={'center'}
        layout
        minHeight={24}
        minWidth={24}
        ref={content}
        shadowColor={Colors.Tailwind.Slate['950']}
        shadowOffset={1}
      >
        {props.children}
      </Rect>
    </Rect>
  );
};
