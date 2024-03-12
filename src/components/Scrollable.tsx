import {
  Rect,
  RectProps,
  Node,
  Layout,
  computed,
  vector2Signal,
  initial,
  nodeName,
} from '@motion-canvas/2d';
import {
  InterpolationFunction,
  PossibleVector2,
  SignalValue,
  TimingFunction,
  Vector2,
  Vector2Signal,
  createRef,
  waitFor,
} from '@motion-canvas/core';
import {Colors} from '../Colors';

export enum ScrollableOrientation {
  Horizontal,
  Vertical,
}

export interface ScrollableProps extends RectProps {
  orientation?: ScrollableOrientation;
  inactiveOpacity?: SignalValue<number>;
  scrollOffset?: SignalValue<PossibleVector2>;
}

@nodeName('Scrollable')
export class Scrollable extends Rect {
  public declare readonly orientation: ScrollableOrientation;

  @computed()
  public contentsSize() {
    return new Vector2(
      this.contentsRef()
        .childrenAs<Layout>()
        .reduce(
          ({x, y}, child) => {
            if (!(child instanceof Layout)) {
              return {x, y};
            }

            return this.orientation === ScrollableOrientation.Vertical
              ? {
                  x: Math.max(x, child.size().width),
                  y: child.size().height + y,
                }
              : {
                  x: child.size().width + x,
                  y: Math.max(y, child.size().height),
                };
          },
          {x: 0, y: 0},
        ),
    );
  }

  @computed()
  public contentsProportion() {
    return this.size().div(this.contentsSize());
  }

  @initial(0)
  @vector2Signal('scrollOffset')
  public declare readonly scrollOffset: Vector2Signal<number>;

  @initial(0.5)
  @vector2Signal('inactiveOpacity')
  public declare readonly inactiveOpacity: Vector2Signal<number>;

  private readonly scrollOpacity = Vector2.createSignal();

  @computed()
  private scrollOpacityY() {
    if (this.contentsProportion().y > 1.05) {
      return 0;
    }
    if (this.contentsProportion().y > 1) {
      return (1.05 - this.contentsProportion().y) * 10;
    }
    return this.scrollOpacity().y;
  }

  @computed()
  private scrollOpacityX() {
    if (this.contentsProportion().x > 1.05) {
      return 0;
    }
    if (this.contentsProportion().x > 1) {
      return (1.05 - this.contentsProportion().x) * 10;
    }
    return this.scrollOpacity().x;
  }

  private readonly contentsRef = createRef<Layout>();

  public constructor(props: ScrollableProps) {
    super({...props, clip: true});
    this.scrollOpacity(this.inactiveOpacity);

    this.add(
      <Layout layout={false}>
        <Node position={this.scrollOffset}>
          <Layout
            ref={this.contentsRef}
            direction={
              this.orientation == ScrollableOrientation.Horizontal
                ? 'row'
                : 'column'
            }
          >
            {props.children}
          </Layout>
        </Node>
        <Rect
          x={() => this.size().x / 2 - 15}
          height={() => this.contentsProportion().y * this.size().y}
          y={() => -this.scrollOffset().y * (this.contentsProportion().y * 0.8)}
          width={10}
          radius={5}
          opacity={this.scrollOpacityY}
          fill={Colors.Tailwind.Slate['50']}
        ></Rect>
        <Rect
          y={() => this.size().y / 2 - 15}
          height={10}
          width={() => this.contentsProportion().x * this.size().x}
          x={() => -this.scrollOffset().x * (this.contentsProportion().x * 0.8)}
          radius={5}
          opacity={this.scrollOpacityX}
          fill={Colors.Tailwind.Slate['50']}
        ></Rect>
      </Layout>,
    );
  }

  public *scrollTo(
    offset: PossibleVector2,
    duration: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ) {
    const _offset = new Vector2(offset);
    yield this.scrollOpacity(
      () => [
        _offset.x != this.scrollOffset().x ? 1 : this.inactiveOpacity().x,
        _offset.y != this.scrollOffset().y ? 1 : this.inactiveOpacity().y,
      ],
      0.1,
    );
    yield this.scrollOffset(
      offset,
      duration,
      timingFunction,
      interpolationFunction,
    );
    yield* waitFor(duration - 0.2);
    yield this.scrollOpacity(this.inactiveOpacity, 0.1);
  }

  public *scrollBy(
    offset: PossibleVector2,
    duration: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ) {
    const _offset = new Vector2(offset);
    yield this.scrollOpacity(
      [
        _offset.x ? 1 : this.inactiveOpacity().x,
        _offset.y ? 1 : this.inactiveOpacity().y,
      ],
      0.1,
    );
    yield this.scrollOffset(
      this.scrollOffset().add(offset),
      duration,
      timingFunction,
      interpolationFunction,
    );
    yield* waitFor(duration - 0.2);
    yield this.scrollOpacity(this.inactiveOpacity, 0.1);
  }

  public *scrollToLeft(
    duration: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ) {
    yield* this.scrollTo(
      {
        x: this.contentsSize().mul(0.5).x - this.size().x / 2,
        y: this.scrollOffset().y,
      },
      duration,
      timingFunction,
      interpolationFunction,
    );
  }

  public *scrollToTop(
    duration: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ) {
    yield* this.scrollTo(
      {
        x: this.scrollOffset().x,
        y: this.contentsSize().mul(0.5).y - this.size().y / 2,
      },
      duration,
      timingFunction,
      interpolationFunction,
    );
  }

  public *scrollToRight(
    duration: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ) {
    yield* this.scrollTo(
      {
        x: -this.contentsSize().mul(0.5).x + this.size().x / 2,
        y: this.scrollOffset().y,
      },
      duration,
      timingFunction,
      interpolationFunction,
    );
  }

  public *scrollToBottom(
    duration: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ) {
    yield* this.scrollTo(
      {
        x: this.scrollOffset().x,
        y: -this.contentsSize().mul(0.5).y + this.size().y / 2,
      },
      duration,
      timingFunction,
      interpolationFunction,
    );
  }
}
