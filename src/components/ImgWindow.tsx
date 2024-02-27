import {Rect, Img} from '@motion-canvas/2d';
import {
  Reference,
  SignalValue,
  PossibleVector2,
  createComputed,
  Vector2,
  unwrap,
} from '@motion-canvas/core';
import {Colors, Window, WindowProps, WindowStyle} from '..';

export const ImgWindow = (
  props: Omit<WindowProps, 'size'> & {
    src: string;
    ref: Reference<Window>;
    padding?: number;
    size?: SignalValue<PossibleVector2<number>>;
  },
) => {
  const sz = createComputed(() => new Vector2(unwrap(props.size)));
  return (
    <Window
      windowStyle={WindowStyle.Windows98}
      title={props.title}
      inactiveOpacity={0}
      shadowColor={Colors.Tailwind.Slate['950'] + '80'}
      shadowOffset={20}
      ref={props.ref}
      {...props}
      size={() => sz().addY(50)}
    >
      <Rect padding={props.padding}>
        <Img src={props.src} size={() => sz().sub(props.padding)}></Img>
      </Rect>
    </Window>
  );
};
