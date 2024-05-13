import {Layout, LayoutProps} from '@motion-canvas/2d';

export const Row = (props: LayoutProps) => (
  <Layout {...props} direction={'row'} layout />
);

export const Column = (props: LayoutProps) => (
  <Layout {...props} direction={'column'} layout />
);
