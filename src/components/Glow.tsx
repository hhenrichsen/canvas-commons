import {Layout, LayoutProps, initial, signal} from '@motion-canvas/2d';
import {SignalValue, SimpleSignal, clamp} from '@motion-canvas/core';

export interface GlowProps extends LayoutProps {
  amount?: SignalValue<number>;
  copyOpacity?: SignalValue<number>;
}

export class Glow extends Layout {
  @initial(10)
  @signal()
  public declare readonly amount: SimpleSignal<number, this>;

  @initial(1)
  @signal()
  public declare readonly copyOpacity: SimpleSignal<number, this>;

  public constructor(props: GlowProps) {
    super({...props});
  }

  protected draw(context: CanvasRenderingContext2D): void {
    super.draw(context);

    context.save();
    context.globalAlpha = clamp(0, 1, this.copyOpacity());
    context.filter = `blur(${this.amount()}px)`;
    context.globalCompositeOperation = 'overlay';
    this.children().forEach(child => child.render(context));
    context.restore();
  }
}
