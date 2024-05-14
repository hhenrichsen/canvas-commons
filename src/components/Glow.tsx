import {Layout, LayoutProps, initial, signal} from '@motion-canvas/2d';
import {SimpleSignal} from '@motion-canvas/core';

export interface GlowProps extends LayoutProps {
  amount?: number;
}

export class Glow extends Layout {
  @initial(10)
  @signal()
  public declare readonly amount: SimpleSignal<number, this>;

  public constructor(props: LayoutProps) {
    super({...props});
  }

  protected draw(context: CanvasRenderingContext2D): void {
    super.draw(context);

    context.save();
    context.filter = `blur(${this.amount()}px)`;
    context.globalCompositeOperation = 'overlay';
    this.children().forEach(child => child.render(context));
    context.restore();
  }
}
