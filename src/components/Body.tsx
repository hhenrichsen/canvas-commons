import {Layout, LayoutProps, Txt, TxtProps} from '@motion-canvas/2d';
import {Colors} from '../Colors';
import {SignalValue, createComputed, unwrap} from '@motion-canvas/core';

export const Text = {
  fontFamily: 'Montserrat',
  fill: Colors.Tailwind.Slate['100'],
  fontSize: 36,
};

export const Title: TxtProps = {
  ...Text,
  fontSize: 64,
  fontWeight: 700,
};

export const Bold = (props: TxtProps) => <Txt {...props} fontWeight={700} />;

export const Em = (props: TxtProps) => <Txt {...props} fontStyle={'italic'} />;

export const Body = (
  props: LayoutProps & {
    text: string;
    wrapAt?: SignalValue<number>;
    txtProps?: TxtProps;
  },
) => {
  const wrapAt = props.wrapAt ?? 20;
  const lines = createComputed(() =>
    props.text.split(' ').reduce<string[]>((acc, word) => {
      if (acc.length === 0) {
        return [word];
      }
      if (acc[acc.length - 1].length + word.length > unwrap(wrapAt)) {
        return [...acc, word];
      }
      return [...acc.slice(0, -1), `${acc[acc.length - 1]} ${word}`];
    }, []),
  );

  const children = createComputed(() =>
    lines().map(line => (
      <Txt {...Text} {...props.txtProps}>
        {line}
      </Txt>
    )),
  );

  return (
    <Layout layout direction={'column'} {...props}>
      {children()}
    </Layout>
  );
};
