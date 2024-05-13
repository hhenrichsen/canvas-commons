import {Code, Layout, LayoutProps, Txt, TxtProps} from '@motion-canvas/2d';
import {Reference, range} from '@motion-canvas/core';

export interface CodeLineNumbersProps extends LayoutProps {
  code: Reference<Code>;
  numberProps?: TxtProps;
  rootLayoutProps?: LayoutProps;
  columnLayoutProps?: LayoutProps;
}

export class CodeLineNumbers extends Layout {
  public constructor(props: CodeLineNumbersProps) {
    super({
      ...props,
      layout: true,
      justifyContent: 'space-evenly',
      direction: 'column',
    });
    this.children(() =>
      range(props.code().parsed().split('\n').length).map(i => (
        <Txt
          {...props.numberProps}
          fontFamily={props.code().fontFamily}
          textAlign={'right'}
          fontSize={props.code().fontSize}
          text={(i + 1).toString()}
        />
      )),
    );
  }
}
