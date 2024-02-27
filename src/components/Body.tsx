import {Colors} from '@components/Colors';
import {Txt, TxtProps} from '@motion-canvas/2d';

export const Text: TxtProps = {
  fontFamily: 'Montserrat',
  fill: Colors.Tailwind.Slate['100'],
  fontSize: 36,
};

export const Title: TxtProps = {
  ...Text,
  fontSize: 64,
  fontWeight: 700,
};

export const Body = (props: {text: string; wrapAt?: number}) => {
  const wrapAt = props.wrapAt ?? 20;
  return (
    <>
      {...props.text
        .split(' ')
        .reduce<string[]>((acc, word) => {
          if (acc.length === 0) {
            return [word];
          }
          if (acc[acc.length - 1].length + word.length > wrapAt) {
            return [...acc, word];
          }
          return [...acc.slice(0, -1), `${acc[acc.length - 1]} ${word}`];
        }, [])
        .map(line => <Txt {...Text}>{line}</Txt>)}
    </>
  );
};
