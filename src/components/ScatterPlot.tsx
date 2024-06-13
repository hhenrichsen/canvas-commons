import {
  initial,
  signal,
  resolveCanvasStyle,
  canvasStyleSignal,
  CanvasStyleSignal,
  PossibleCanvasStyle,
  computed,
  Layout,
  LayoutProps,
  parser,
} from '@motion-canvas/2d';
import {
  PossibleVector2,
  SignalValue,
  SimpleSignal,
  clamp,
  useLogger,
} from '@motion-canvas/core';
import {Plot} from './Plot';

export interface ScatterPlotProps extends LayoutProps {
  pointRadius?: number;
  pointColor?: PossibleCanvasStyle;
  data?: SignalValue<PossibleVector2[]>;
  start?: SignalValue<number>;
  end?: SignalValue<number>;
}

export class ScatterPlot extends Layout {
  @initial(5)
  @signal()
  public declare readonly pointRadius: SimpleSignal<number, this>;

  @initial('white')
  @canvasStyleSignal()
  public declare readonly pointColor: CanvasStyleSignal<this>;

  @signal()
  public declare readonly data: SimpleSignal<[number, number][], this>;

  @initial(0)
  @parser((value: number) => clamp(0, 1, value))
  @signal()
  public declare readonly start: SimpleSignal<number, this>;

  @initial(1)
  @parser((value: number) => clamp(0, 1, value))
  @signal()
  public declare readonly end: SimpleSignal<number, this>;

  @computed()
  private firstIndex() {
    return Math.ceil(this.data().length * this.start() + 1);
  }

  @computed()
  private firstPointProgress() {
    return this.firstIndex() - this.start() * this.data().length;
  }

  @computed()
  private lastIndex() {
    return Math.floor(this.data().length * this.end() - 1);
  }

  @computed()
  private pointProgress() {
    return this.end() * this.data().length - this.lastIndex();
  }

  public constructor(props?: ScatterPlotProps) {
    super({
      ...props,
    });
  }

  protected draw(context: CanvasRenderingContext2D): void {
    context.save();
    context.fillStyle = resolveCanvasStyle(this.pointColor(), context);

    const parent = this.parent();
    if (!(parent instanceof Plot)) {
      useLogger().warn('Using a ScatterPlot outside of a Plot does nothing');
      return;
    }

    if (this.firstIndex() < this.lastIndex()) {
      const firstPoint = this.data()[this.firstIndex() - 1];

      const coord = parent.getPointFromPlotSpace(firstPoint);

      context.beginPath();
      context.arc(
        coord.x,
        coord.y,
        this.pointRadius() * this.firstPointProgress(),
        0,
        Math.PI * 2,
      );
      context.fill();
    }

    const data = this.data();
    data.slice(this.firstIndex(), this.lastIndex()).forEach(point => {
      const coord = parent.getPointFromPlotSpace(point);

      context.beginPath();
      context.arc(coord.x, coord.y, this.pointRadius(), 0, Math.PI * 2);
      context.fill();
    });

    if (this.lastIndex() > this.firstIndex()) {
      const lastPoint = data[this.lastIndex()];

      const lastCoord = parent.getPointFromPlotSpace(lastPoint);

      context.beginPath();
      context.arc(
        lastCoord.x,
        lastCoord.y,
        this.pointRadius() * this.pointProgress(),
        0,
        Math.PI * 2,
      );
      context.fill();
    }

    context.restore();
  }
}
