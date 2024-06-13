import {signal, Line, LineProps} from '@motion-canvas/2d';
import {BBox, SimpleSignal, Vector2, useLogger} from '@motion-canvas/core';
import {Plot} from './Plot';

export interface LinePlotProps extends LineProps {
  data?: [number, number][];
  points?: never;
}

export class LinePlot extends Line {
  @signal()
  public declare readonly data: SimpleSignal<[number, number][], this>;

  public constructor(props?: LinePlotProps) {
    super({
      ...props,
      points: props.data,
    });
  }

  public override parsedPoints(): Vector2[] {
    const parent = this.parent();
    if (!(parent instanceof Plot)) {
      useLogger().warn(
        'Using a LinePlot outside of a Plot is the same as a Line',
      );
      return super.parsedPoints();
    }
    const data = this.data().map(point => parent.getPointFromPlotSpace(point));
    return data;
  }

  protected childrenBBox(): BBox {
    return BBox.fromPoints(...this.parsedPoints());
  }
}
