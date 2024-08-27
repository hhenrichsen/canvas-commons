import {
  initial,
  Layout,
  LayoutProps,
  signal,
  vector2Signal,
} from '@motion-canvas/2d';
import crt from './scanlines.glsl';
import {
  SignalValue,
  SimpleSignal,
  useScene,
  Vector2,
  Vector2Signal,
} from '@motion-canvas/core';

export interface ScanlineProps extends LayoutProps {
  reflectionOffset?: SignalValue<Vector2>;
  rowSize?: SignalValue<number>;
  baseBrightness?: SignalValue<number>;
  effectStrength?: SignalValue<number>;
  maxBrightness?: SignalValue<number>;
  scanSpeed?: SignalValue<number>;
  shaders?: never;
}

export class Scanlines extends Layout {
  @initial([16, 16])
  @vector2Signal('reflectionOffset')
  public declare readonly reflectionOffset: Vector2Signal;

  @initial(1)
  @signal()
  public declare readonly rowSize: SimpleSignal<number>;

  @initial(0.7)
  @signal()
  public declare readonly baseBrightness: SimpleSignal<number>;

  @initial(0.6)
  @signal()
  public declare readonly effectStrength: SimpleSignal<number>;

  @initial(1.3)
  @signal()
  public declare readonly maxBrightness: SimpleSignal<number>;

  @initial(1.0)
  @signal()
  public declare readonly scanSpeed: SimpleSignal<number>;

  public constructor(props: ScanlineProps) {
    super({
      ...props,
    });
    this.cachePadding(() => {
      const offset = this.reflectionOffset().add([8, 8]);
      return {
        top: offset.y,
        right: offset.x,
        bottom: offset.y,
        left: offset.x,
      };
    });
    this.shaders({
      fragment: crt,
      uniforms: {
        rowSize:
          this.rowSize() *
          Math.max(1, useScene().getRealSize().x / useScene().getSize().x),
        baseBrightness: this.baseBrightness,
        maxBrightness: this.maxBrightness,
        effectStrength: this.effectStrength,
        scanSpeed: this.scanSpeed,
        reflectionOffset: this.reflectionOffset().mul(
          Math.max(1, useScene().getRealSize().x / useScene().getSize().x),
        ),
        aberrationPx: Math.max(
          1,
          useScene().getRealSize().x / useScene().getSize().x,
        ),
      },
    });
  }
}
