import {
  Layout,
  LayoutProps,
  computed,
  Node,
  RectProps,
  Rect,
  PossibleCanvasStyle,
  CanvasStyleSignal,
  canvasStyleSignal,
  initial,
  signal,
} from '@motion-canvas/2d';
import {
  SignalValue,
  SimpleSignal,
  createEffect,
  useLogger,
} from '@motion-canvas/core';

export interface TableProps extends LayoutProps {
  stroke?: SignalValue<PossibleCanvasStyle>;
  lineWidth?: SignalValue<number>;
}

export class Table extends Layout {
  @initial('white')
  @canvasStyleSignal()
  public declare readonly stroke: CanvasStyleSignal<this>;

  @initial(1)
  @signal()
  public declare readonly lineWidth: SimpleSignal<number, this>;

  public constructor(props: TableProps) {
    super({...props, layout: true, direction: 'column'});

    createEffect(() => {
      this.rowChildren().forEach(row => {
        row.dataChildren().forEach((data, idx) => {
          data.width(this.columnSizes()[idx] ?? 0);
          data.stroke(this.stroke());
          data.lineWidth(this.lineWidth());
        });
      });
    });
  }

  @computed()
  public rowChildren() {
    return this.children().filter(
      (child): child is TableRow => child instanceof TableRow,
    );
  }

  @computed()
  public columnSizes() {
    return this.children()
      .filter((child): child is TableRow => child instanceof TableRow)
      .reduce((sizes: number[], row: TableRow) => {
        row
          .children()
          .filter((child): child is TableData => child instanceof TableData)
          .forEach((data, i) => {
            if (sizes[i] === undefined) {
              sizes[i] = 0;
            }
            sizes[i] = Math.max(data.size().x, sizes[i]);
          });
        return sizes;
      }, []);
  }
}

export class TableRow extends Layout {
  public constructor(props: LayoutProps) {
    super({...props, layout: true, direction: 'row'});

    this.children().forEach(child => {
      child.parent(this);
    });

    if (this.children().some(child => !(child instanceof TableData))) {
      useLogger().warn(
        'Table rows must only contain TableData; other nodes are undefined behavior',
      );
    }
  }

  @computed()
  public dataChildren() {
    return this.children().filter(
      (child): child is TableData => child instanceof TableData,
    );
  }
}

export interface TableDataProps extends RectProps {
  children?: Node[] | Node;
}

export class TableData extends Rect {
  public constructor(props: TableDataProps) {
    super({
      padding: 8,
      lineWidth: 2,
      ...props,
    });
  }
}
