import {Layout, Txt, View2D} from '@motion-canvas/2d';
import {Windows98Button} from './WindowsButton';
import {Window, WindowProps, WindowStyle} from './Window';
import {
  PossibleVector2,
  Reference,
  SignalValue,
  Vector2,
  all,
  beginSlide,
  chain,
  createComputed,
  createRef,
  sequence,
  unwrap,
  useRandom,
} from '@motion-canvas/core';
import {Colors} from '../Colors';
import {Body} from './Body';
import {belowScreenPosition} from '../Util';

export const ErrorBox = (
  props: Omit<WindowProps, 'size'> & {
    error: string;
    size?: SignalValue<PossibleVector2<number>>;
    wrapAt?: SignalValue<number>;
  },
) => {
  const sz = createComputed(
    () => new Vector2(unwrap(props.size ?? [500, 300])),
  );
  return (
    <Window
      ref={props.ref}
      {...props}
      windowStyle={WindowStyle.Windows98}
      bodyColor={Colors.Tailwind.Slate['400']}
      size={() => sz().addY(50)}
    >
      <>
        <Layout direction={'column'}>
          <Body
            text={props.error}
            y={-50}
            fontSize={24}
            wrapAt={props.wrapAt ?? 20}
            txtProps={{fill: Colors.Tailwind.Slate['950']}}
          ></Body>
          <Windows98Button y={sz().y / 2 - 50}>
            <Txt width={300} textAlign={'center'} fontSize={24} padding={8}>
              OK
            </Txt>
          </Windows98Button>
        </Layout>
      </>
    </Window>
  );
};

export function* errorBoxes(messages: string[], view: View2D, prefix: string) {
  const refs = messages.map(message => [message, createRef<Window>()]) as [
    string,
    Reference<Window>,
  ][];
  const random = useRandom();
  yield* chain(
    ...refs.map(([message, ref], i) => {
      view.add(
        <ErrorBox
          error={message}
          ref={ref}
          fontSize={24}
          scale={0}
          position={[
            random.nextInt(300 - view.size().x / 2, view.size().x / 2 - 300),
            random.nextInt(300 - view.size().y / 2, view.size().y / 2 - 300),
          ]}
        />,
      );
      const p = ref().position();
      ref().position(belowScreenPosition(view, ref));
      return all(
        ref().position(p, 1),
        ref().scale(1, 1),
        beginSlide(`${prefix}-${i}`),
      );
    }),
  );
  return {
    refs,
    closeAll: function* () {
      yield* sequence(
        0.2,
        ...refs.reverse().map(([, ref]) => ref().close(view, 1)),
      );
    },
  };
}
