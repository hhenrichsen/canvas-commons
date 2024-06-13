import {
  CanvasStyleSignal,
  Layout,
  LayoutProps,
  canvasStyleSignal,
  computed,
  drawRect,
  initial,
  resolveCanvasStyle,
  signal,
  vector2Signal,
} from '@motion-canvas/2d';
import {
  BBox,
  PossibleColor,
  PossibleVector2,
  SignalValue,
  SimpleSignal,
  Vector2,
  Vector2Signal,
  range,
} from '@motion-canvas/core';

export interface PlotProps extends LayoutProps {
  minX?: SignalValue<number>;
  minY?: SignalValue<number>;
  min?: SignalValue<PossibleVector2>;

  maxX?: SignalValue<number>;
  maxY?: SignalValue<number>;
  max?: SignalValue<PossibleVector2>;

  ticksX?: SignalValue<number>;
  ticksY?: SignalValue<number>;
  ticks?: SignalValue<PossibleVector2>;

  labelSizeX?: SignalValue<number>;
  labelSizeY?: SignalValue<number>;
  labelSize?: SignalValue<PossibleVector2>;

  labelPaddingX?: SignalValue<number>;
  labelPaddingY?: SignalValue<number>;
  labelPadding?: SignalValue<PossibleVector2>;

  tickPaddingX?: SignalValue<number>;
  tickPaddingY?: SignalValue<number>;
  tickPadding?: SignalValue<PossibleVector2>;

  tickLabelSizeX?: SignalValue<number>;
  tickLabelSizeY?: SignalValue<number>;
  tickLabelSize?: SignalValue<PossibleVector2>;

  tickOverflowX?: SignalValue<number>;
  tickOverflowY?: SignalValue<number>;
  tickOverflow?: SignalValue<PossibleVector2>;

  gridStrokeWidth?: SignalValue<number>;
  axisStrokeWidth?: SignalValue<number>;

  labelX?: SignalValue<string>;
  axisColorX?: SignalValue<PossibleColor>;
  axisTextColorX?: SignalValue<PossibleColor>;

  labelY?: SignalValue<string>;
  axisColorY?: SignalValue<PossibleColor>;
  axisTextColorY?: SignalValue<PossibleColor>;

  labelFormatterX?: (x: number) => string;
  labelFormatterY?: (y: number) => string;
}

export class Plot extends Layout {
  @initial(Vector2.zero)
  @vector2Signal('min')
  public declare readonly min: Vector2Signal<this>;

  @initial(Vector2.one.mul(100))
  @vector2Signal('max')
  public declare readonly max: Vector2Signal<this>;

  @initial(Vector2.one.mul(10))
  @vector2Signal('ticks')
  public declare readonly ticks: Vector2Signal<this>;

  @initial(Vector2.one.mul(30))
  @vector2Signal('labelSize')
  public declare readonly labelSize: Vector2Signal<this>;

  @initial(Vector2.one.mul(5))
  @vector2Signal('labelPadding')
  public declare readonly labelPadding: Vector2Signal<this>;

  @initial(Vector2.one.mul(10))
  @vector2Signal('tickLabelSize')
  public declare readonly tickLabelSize: Vector2Signal<this>;

  @initial(Vector2.one.mul(5))
  @vector2Signal('tickOverflow')
  public declare readonly tickOverflow: Vector2Signal<this>;

  @initial(Vector2.one.mul(6))
  @vector2Signal('tickPadding')
  public declare readonly tickPadding: Vector2Signal<this>;

  @initial(Vector2.one.mul(1))
  @vector2Signal('gridStrokeWidth')
  public declare readonly gridStrokeWidth: Vector2Signal<this>;

  @initial(Vector2.one.mul(2))
  @vector2Signal('axisStrokeWidth')
  public declare readonly axisStrokeWidth: Vector2Signal<this>;

  @initial('white')
  @canvasStyleSignal()
  public declare readonly axisColorX: CanvasStyleSignal<this>;

  @initial('white')
  @canvasStyleSignal()
  public declare readonly axisTextColorX: CanvasStyleSignal<this>;

  @initial('')
  @signal()
  public declare readonly labelX: SimpleSignal<string, this>;

  @initial('white')
  @canvasStyleSignal()
  public declare readonly axisColorY: CanvasStyleSignal<this>;

  @initial('white')
  @canvasStyleSignal()
  public declare readonly axisTextColorY: CanvasStyleSignal<this>;

  @initial('')
  @signal()
  public declare readonly labelY: SimpleSignal<string, this>;

  public readonly labelFormatterX: (x: number) => string;
  public readonly labelFormatterY: (y: number) => string;

  @computed()
  private edgePadding() {
    return this.labelSize()
      .add(this.labelPadding())
      .add(this.tickLabelSize().mul([Math.log10(this.max().y) + 1, 2]))
      .add(this.tickOverflow())
      .add(this.axisStrokeWidth());
  }

  public constructor(props?: PlotProps) {
    super(props);
    this.labelFormatterX = props.labelFormatterX ?? (x => x.toFixed(0));
    this.labelFormatterY = props.labelFormatterY ?? (y => y.toFixed(0));
  }

  public cacheBBox(): BBox {
    return BBox.fromSizeCentered(this.size().add(this.edgePadding().mul(2)));
  }

  protected draw(context: CanvasRenderingContext2D): void {
    const halfSize = this.computedSize().mul(-0.5);

    for (let i = 0; i <= this.ticks().floored.x; i++) {
      const startPosition = halfSize.add(
        this.computedSize().mul([i / this.ticks().x, 1]),
      );

      context.beginPath();
      context.moveTo(
        startPosition.x,
        startPosition.y +
          this.tickOverflow().x +
          this.axisStrokeWidth().x / 2 +
          this.axisStrokeWidth().x / 2,
      );
      context.lineTo(startPosition.x, halfSize.y);
      context.strokeStyle = resolveCanvasStyle(this.axisColorX(), context);
      context.lineWidth = this.gridStrokeWidth().x;
      context.stroke();

      context.fillStyle = resolveCanvasStyle(this.axisTextColorX(), context);
      context.font = `${this.tickLabelSize().y}px sans-serif`;
      context.textAlign = 'center';
      context.textBaseline = 'top';
      context.fillText(
        `${this.labelFormatterX(this.mapToX(i / this.ticks().x))}`,
        startPosition.x,
        startPosition.y +
          this.axisStrokeWidth().x +
          this.tickOverflow().x +
          Math.floor(this.tickPadding().x / 2),
      );
    }

    for (let i = 0; i <= this.ticks().floored.y; i++) {
      const startPosition = halfSize.add(
        this.computedSize().mul([1, 1 - i / this.ticks().y]),
      );

      context.beginPath();
      context.moveTo(startPosition.x, startPosition.y);
      context.lineTo(halfSize.x - this.tickOverflow().y, startPosition.y);
      context.strokeStyle = resolveCanvasStyle(this.axisColorY(), context);
      context.lineWidth = this.gridStrokeWidth().y;
      context.stroke();

      context.fillStyle = resolveCanvasStyle(this.axisTextColorY(), context);
      context.font = `${this.tickLabelSize().y}px ${this.fontFamily()}`;
      context.textAlign = 'right';
      context.textBaseline = 'middle';
      context.fillText(
        `${this.labelFormatterY(this.mapToY(i / this.ticks().y))}`,
        halfSize.x -
          this.axisStrokeWidth().y -
          this.tickOverflow().y -
          Math.floor(this.tickPadding().y / 2),
        startPosition.y,
      );
    }

    context.beginPath();
    const yAxisStartPoint = this.getPointFromPlotSpace([0, this.min().y]);
    const yAxisEndPoint = this.getPointFromPlotSpace([0, this.max().y]);
    context.moveTo(
      yAxisStartPoint.x - this.gridStrokeWidth().y / 2,
      yAxisStartPoint.y - this.gridStrokeWidth().y / 2,
    );
    context.lineTo(
      yAxisEndPoint.x - this.gridStrokeWidth().y / 2,
      yAxisEndPoint.y + this.gridStrokeWidth().y / 2,
    );
    context.strokeStyle = resolveCanvasStyle(this.axisColorX(), context);
    context.lineWidth = this.axisStrokeWidth().x;
    context.stroke();

    context.beginPath();
    const xAxisStartPoint = this.getPointFromPlotSpace([this.min().x, 0]);
    const xAxisEndPoint = this.getPointFromPlotSpace([this.max().x, 0]);
    context.moveTo(
      xAxisStartPoint.x - this.gridStrokeWidth().x / 2,
      xAxisStartPoint.y + this.gridStrokeWidth().x / 2,
    );
    context.lineTo(
      xAxisEndPoint.x + this.gridStrokeWidth().x / 2,
      xAxisEndPoint.y + this.gridStrokeWidth().x / 2,
    );
    context.strokeStyle = resolveCanvasStyle(this.axisColorY(), context);
    context.lineWidth = this.axisStrokeWidth().y;
    context.stroke();

    // Draw X axis label
    context.fillStyle = resolveCanvasStyle(this.axisTextColorX(), context);
    context.font = `${this.labelSize().y}px ${this.fontFamily()}`;
    context.textAlign = 'center';
    context.textBaseline = 'alphabetic';
    context.fillText(
      this.labelX(),
      0,
      -halfSize.y +
        this.axisStrokeWidth().x +
        this.tickOverflow().x +
        this.tickLabelSize().x +
        this.tickPadding().x +
        Math.floor(this.labelPadding().x) +
        this.labelSize().x,
    );

    // Draw rotated Y axis label
    context.fillStyle = resolveCanvasStyle(this.axisTextColorY(), context);
    context.font = `${this.labelSize().y}px ${this.fontFamily()}`;
    context.textAlign = 'center';
    context.textBaseline = 'alphabetic';
    context.save();
    context.translate(
      halfSize.x -
        this.axisStrokeWidth().y -
        this.tickOverflow().y -
        this.tickLabelSize().y -
        this.tickPadding().y -
        Math.floor(this.labelPadding().y / 2) -
        this.labelSize().y,
      0,
    );
    context.rotate(-Math.PI / 2);
    context.fillText(this.labelY(), 0, 0);
    context.restore();

    if (this.clip()) {
      context.clip(this.getPath());
    }
    this.drawChildren(context);
  }

  public getPath(): Path2D {
    const path = new Path2D();
    const box = BBox.fromSizeCentered(this.size());
    drawRect(path, box);

    return path;
  }

  public getPointFromPlotSpace(point: PossibleVector2) {
    const bottomLeft = this.computedSize().mul([-0.5, 0.5]);

    return this.toRelativeGridSize(point)
      .mul([1, -1])
      .mul(this.computedSize())
      .add(bottomLeft);
  }

  private mapToX(value: number) {
    return this.min().x + value * (this.max().x - this.min().x);
  }

  private mapToY(value: number) {
    return this.min().y + value * (this.max().y - this.min().y);
  }

  private toRelativeGridSize(p: PossibleVector2) {
    return new Vector2(p).sub(this.min()).div(this.max().sub(this.min()));
  }

  public makeGraphData(
    resolution: number,
    f: (x: number) => number,
  ): [number, number][] {
    return range(this.min().x, this.max().x + resolution, resolution).map(x => [
      x,
      f(x),
    ]);
  }
}
