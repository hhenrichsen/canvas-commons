import {
  Rect,
  RectProps,
  Node,
  Layout,
  computed,
  vector2Signal,
  initial,
  nodeName,
  signal,
  Curve,
} from '@motion-canvas/2d';
import {
  BBox,
  InterpolationFunction,
  PossibleVector2,
  SignalValue,
  SimpleSignal,
  TimingFunction,
  Vector2,
  Vector2Signal,
  all,
  clampRemap,
  createRef,
  createSignal,
  delay,
  easeInOutCubic,
  map,
  unwrap,
  useLogger,
} from '@motion-canvas/core';
import {Colors} from '../Colors';
import {signum} from '@Util';

export interface ScrollableProps extends RectProps {
  activeOpacity?: SignalValue<number>;
  inactiveOpacity?: SignalValue<number>;
  handleProps?: RectProps;
  scrollHandleDelay?: SignalValue<number>;
  scrollHandleDuration?: SignalValue<number>;
  scrollOffset?: SignalValue<PossibleVector2>;
  scrollPadding?: SignalValue<PossibleVector2>;
  handleWidth?: SignalValue<number>;
  handleInset?: SignalValue<number>;
  zoom?: SignalValue<number>;
}

@nodeName('Scrollable')
export class Scrollable extends Rect {
  @initial(0)
  @vector2Signal('scrollOffset')
  public declare readonly scrollOffset: Vector2Signal<number>;

  @initial(4)
  @vector2Signal('scrollPadding')
  public declare readonly scrollPadding: Vector2Signal<number>;

  @initial(0.5)
  @vector2Signal('inactiveOpacity')
  public declare readonly inactiveOpacity: Vector2Signal<number>;

  @initial(1)
  @vector2Signal('activeOpacity')
  public declare readonly activeOpacity: Vector2Signal<number>;

  @initial(8)
  @signal()
  public declare readonly handleWidth: SimpleSignal<number>;

  @initial(16)
  @signal()
  public declare readonly handleInset: SimpleSignal<number>;

  @initial(1)
  @signal()
  public declare readonly zoom: SimpleSignal<number>;

  @initial(-0.2)
  @signal()
  public declare readonly scrollHandleDelay: SimpleSignal<number>;

  @signal()
  public declare readonly scrollHandleDuration: SimpleSignal<number>;

  private readonly scrollOpacity = Vector2.createSignal();

  @signal()
  private readonly pathProgress = createSignal(0);

  @signal()
  private readonly path = createSignal<Curve>();

  @computed()
  private inverseZoom() {
    return 1 / this.zoom();
  }

  @computed()
  public contentsBox() {
    return this.contentsRef()
      .childrenAs<Layout>()
      .reduce(
        (b, child) => {
          if (!(child instanceof Layout)) {
            return b;
          }
          const combinedLowX = Math.min(
            b.x,
            child.position().x - child.size().x / 2,
          );
          const combinedLowY = Math.min(
            b.y,
            child.position().y - child.size().y / 2,
          );
          const combinedHighX = Math.max(
            b.x + b.width,
            child.position().x + child.size().x / 2,
          );
          const combinedHighY = Math.max(
            b.y + b.height,
            child.position().y + child.size().y / 2,
          );

          return new BBox(
            combinedLowX,
            combinedLowY,
            combinedHighX - combinedLowX,
            combinedHighY - combinedLowY,
          );
        },
        // Always start with the scrollable's size.
        new BBox(
          -this.size().x / 2,
          -this.size().y / 2,
          this.size().x,
          this.size().y,
        ),
      );
  }

  @computed()
  private contentsSize() {
    return this.contentsBox().size;
  }

  @computed()
  private contentsProportion() {
    return this.size()
      .mul(this.inverseZoom())
      .div([this.contentsSize().width, this.contentsSize().height]);
  }

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
    if (this.contentsProportion().x > 1) {
      return 0;
    }
    if (this.contentsProportion().x > 0.95) {
      return (0.95 - this.contentsProportion().x) * 10;
    }
    return this.scrollOpacity().x;
  }

  @computed()
  private handleSize() {
    return this.contentsProportion()
      .mul(this.size())
      .sub(this.handleInset() + this.handleWidth() / 2);
  }

  @computed()
  private handlePosition() {
    const halfHandleSize = this.handleSize().div(2);
    // Map the contents box to the scrollable's size, ensuring that they don't
    // get clipped by going out of bounds.
    return new Vector2(
      clampRemap(
        this.contentsBox().x + this.size().x / 2,
        this.contentsBox().x + this.contentsBox().width - this.size().x / 2,
        -this.size().x / 2 + this.handleInset() / 2 + halfHandleSize.x,
        this.size().x / 2 -
          this.handleWidth() / 2 -
          this.handleInset() -
          halfHandleSize.x,
        this.scrollOffset().x,
      ),
      clampRemap(
        this.contentsBox().y + this.size().y / 2,
        this.contentsBox().y + this.contentsBox().height - this.size().y / 2,
        -this.size().y / 2 + this.handleInset() / 2 + halfHandleSize.y,
        this.size().y / 2 -
          this.handleWidth() / 2 -
          this.handleInset() -
          halfHandleSize.y,
        this.scrollOffset().y,
      ),
    );
  }

  private readonly contentsRef = createRef<Layout>();

  public constructor(props: ScrollableProps) {
    super({...props, clip: true});
    this.scrollOpacity(this.inactiveOpacity);
    this.scrollHandleDuration(
      props.scrollHandleDuration ??
        (props.scrollHandleDelay ? -props.scrollHandleDelay : 0.2),
    );

    this.add(
      <Layout layout={false}>
        <Node
          position={() => this.scrollOffset().mul(-1).mul(this.zoom())}
          scale={this.zoom}
        >
          <Layout ref={this.contentsRef}>{props.children}</Layout>
        </Node>
        <Rect
          fill={Colors.Tailwind.Slate['50']}
          radius={5}
          {...props.handleProps}
          x={() => this.size().x / 2 - this.handleInset()}
          height={() => this.handleSize().y}
          y={() => this.handlePosition().y}
          width={this.handleWidth}
          opacity={this.scrollOpacityY}
        ></Rect>
        <Rect
          fill={Colors.Tailwind.Slate['50']}
          radius={5}
          {...props.handleProps}
          y={() => this.size().y / 2 - this.handleInset()}
          height={this.handleWidth}
          width={() => this.handleSize().x}
          x={() => this.handlePosition().x}
          opacity={this.scrollOpacityX}
        ></Rect>
      </Layout>,
    );
  }

  public *tweenZoom(
    v: SignalValue<number>,
    duration: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<number>,
  ) {
    yield this.scrollOpacity(this.activeOpacity, 0.1);
    yield* all(
      delay(
        duration + this.scrollHandleDelay(),
        this.scrollOpacity(this.inactiveOpacity, this.scrollHandleDuration()),
      ),
      this.zoom.context.tweener(
        v,
        duration,
        timingFunction ?? easeInOutCubic,
        interpolationFunction ?? map,
      ),
    );
  }

  public *tweenScrollOffset(
    offset: SignalValue<PossibleVector2>,
    duration: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ) {
    const _offset = new Vector2(unwrap(offset));
    yield this.scrollOpacity(
      () => [
        _offset.x != this.scrollOffset().x
          ? this.activeOpacity().x
          : this.inactiveOpacity().x,
        _offset.y != this.scrollOffset().y
          ? this.activeOpacity().y
          : this.inactiveOpacity().y,
      ],
      0.1,
    );
    yield* all(
      delay(
        duration + this.scrollHandleDelay(),
        this.scrollOpacity(this.inactiveOpacity, this.scrollHandleDuration()),
      ),
      this.scrollOffset.context.tweener(
        offset,
        duration,
        timingFunction,
        interpolationFunction,
      ),
    );
  }

  public *scrollTo(
    offset: PossibleVector2,
    duration: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ) {
    yield* this.scrollOffset(
      offset,
      duration,
      timingFunction,
      interpolationFunction,
    );
  }

  public *scrollBy(
    offset: PossibleVector2,
    duration: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ) {
    yield* this.scrollTo(
      this.scrollOffset().add(offset),
      duration,
      timingFunction,
      interpolationFunction,
    );
  }

  public *scrollToScaled(
    x: number | undefined,
    y: number | undefined,
    duration: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ) {
    const xSign = signum(0.5 - x);
    const ySign = signum(0.5 - y);
    const viewOffsetX =
      xSign * (this.size().x / 2 - this.scrollPadding().x) * this.inverseZoom();
    const viewOffsetY =
      ySign * (this.size().y / 2 - this.scrollPadding().y) * this.inverseZoom();
    yield* this.scrollTo(
      {
        x:
          x != undefined
            ? this.contentsBox().x + x * this.contentsBox().width + viewOffsetX
            : this.scrollOffset().x,
        y:
          y != undefined
            ? this.contentsBox().y + y * this.contentsBox().height + viewOffsetY
            : this.scrollOffset().y,
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
    yield* this.scrollToScaled(
      undefined,
      0,
      duration,
      timingFunction,
      interpolationFunction,
    );
  }

  public *scrollToTopCenter(
    duration: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ) {
    yield* this.scrollToScaled(
      0.5,
      0,
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
    yield* this.scrollToScaled(
      undefined,
      1,
      duration,
      timingFunction,
      interpolationFunction,
    );
  }

  public *scrollToBottomCenter(
    duration: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ) {
    yield* this.scrollToScaled(
      0.5,
      1,
      duration,
      timingFunction,
      interpolationFunction,
    );
  }

  public *scrollToLeft(
    duration: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ) {
    yield* this.scrollToScaled(
      0,
      undefined,
      duration,
      timingFunction,
      interpolationFunction,
    );
  }

  public *scrollToLeftCenter(
    duration: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ) {
    yield* this.scrollToScaled(
      0,
      0.5,
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
    yield* this.scrollToScaled(
      1,
      undefined,
      duration,
      timingFunction,
      interpolationFunction,
    );
  }

  public *scrollToRightCenter(
    duration: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ) {
    yield* this.scrollToScaled(
      1,
      0.5,
      duration,
      timingFunction,
      interpolationFunction,
    );
  }

  public *scrollToCenter(
    duration: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ) {
    yield* this.scrollToScaled(
      0.5,
      0.5,
      duration,
      timingFunction,
      interpolationFunction,
    );
  }

  public *scrollToTopLeft(
    duration: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ) {
    yield* this.scrollToScaled(
      0,
      0,
      duration,
      timingFunction,
      interpolationFunction,
    );
  }

  public *scrollToTopRight(
    duration: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ) {
    yield* this.scrollToScaled(
      1,
      0,
      duration,
      timingFunction,
      interpolationFunction,
    );
  }

  public *scrollToBottomLeft(
    duration: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ) {
    yield* this.scrollToScaled(
      0,
      1,
      duration,
      timingFunction,
      interpolationFunction,
    );
  }

  public *scrollToBottomRight(
    duration: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ) {
    yield* this.scrollToScaled(
      1,
      1,
      duration,
      timingFunction,
      interpolationFunction,
    );
  }

  public *scrollDown(
    amount: number,
    duration: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ) {
    yield* this.scrollBy(
      [0, amount],
      duration,
      timingFunction,
      interpolationFunction,
    );
  }

  public *scrollUp(
    amount: number,
    duration: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ) {
    yield* this.scrollBy(
      [0, -amount],
      duration,
      timingFunction,
      interpolationFunction,
    );
  }

  public *scrollRight(
    amount: number,
    duration: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ) {
    yield* this.scrollBy(
      [amount, 0],
      duration,
      timingFunction,
      interpolationFunction,
    );
  }

  public *scrollLeft(
    amount: number,
    duration: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<Vector2>,
  ) {
    yield* this.scrollBy(
      [-amount, 0],
      duration,
      timingFunction,
      interpolationFunction,
    );
  }

  public *tweenToAndFollowCurve(
    curve: SignalValue<Curve>,
    navigationDuration: number,
    duration: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<number>,
  ) {
    const c = unwrap(curve);
    yield* this.scrollOffset(
      () => c.getPointAtPercentage(0).position,
      navigationDuration,
    );
    yield* this.followCurve(
      curve,
      duration,
      timingFunction,
      interpolationFunction,
    );
  }

  public *followCurve(
    curve: SignalValue<Curve>,
    duration: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<number>,
  ) {
    yield this.scrollOpacity(this.activeOpacity, 0.1);

    this.path(curve);
    this.scrollOffset(() => {
      const progress = this.pathProgress();
      const p = this.path().getPointAtPercentage(progress).position;
      useLogger().info(`scrollOffset: ${p}`);
      return p;
    });
    yield* all(
      delay(
        duration + this.scrollHandleDelay(),
        this.scrollOpacity(this.inactiveOpacity, this.scrollHandleDuration()),
      ),
      this.pathProgress(1, duration, timingFunction, interpolationFunction),
    );
  }
}
