import {Colors} from '../Colors';
import {
  Icon,
  Layout,
  Rect,
  RectProps,
  Txt,
  colorSignal,
  initial,
  signal,
} from '@motion-canvas/2d';
import {
  Color,
  ColorSignal,
  DEFAULT,
  PossibleColor,
  SignalValue,
  SimpleSignal,
  makeRef,
} from '@motion-canvas/core';

export enum FileType {
  File = 'File',
  Folder = 'Folder',
  Asset = 'Asset',
}

export interface FileStructure {
  name: SignalValue<string>;
  type: FileType;
  id?: string;
  children?: FileStructure[];
}

export interface FileTreeProps extends RectProps {
  structure?: FileStructure;
  folderColor?: SignalValue<PossibleColor>;
  fileColor?: SignalValue<PossibleColor>;
  assetColor?: SignalValue<PossibleColor>;
  labelColor?: SignalValue<PossibleColor>;
  lineColor?: SignalValue<PossibleColor>;
  lineRadius?: SignalValue<number>;
  indentAmount?: SignalValue<number>;
  rowSize?: SignalValue<number>;
}

export class FileTree extends Rect {
  public declare readonly structure: FileStructure;

  @initial(Colors.Tailwind.Amber['500'])
  @colorSignal()
  public declare readonly folderColor: ColorSignal<this>;

  @initial(Colors.Tailwind.Purple['500'])
  @colorSignal()
  public declare readonly assetColor: ColorSignal<this>;

  @initial(Colors.Tailwind.Slate['500'])
  @colorSignal()
  public declare readonly fileColor: ColorSignal<this>;

  @initial(Colors.Tailwind.Slate['100'])
  @colorSignal()
  public declare readonly labelColor: ColorSignal<this>;

  @initial(Colors.Tailwind.Slate['100'])
  @colorSignal()
  public declare readonly lineColor: ColorSignal<this>;

  @initial(5)
  @signal()
  public declare readonly lineRadius: SimpleSignal<number, this>;

  @initial(40)
  @signal()
  public declare readonly rowSize: SimpleSignal<number, this>;

  @signal()
  public declare readonly indentAmount: SimpleSignal<number, this>;

  private readonly refs: Record<
    string,
    {
      txt: Txt;
      icon: Icon;
      container: Rect;
    }
  > = {};

  public constructor(props: FileTreeProps) {
    super({indentAmount: props.rowSize ?? 40, ...props});
    this.structure = props.structure || {name: '/', type: FileType.Folder};
    this.add(this.createRow(this.structure));
  }

  private getIconProps(structure: FileStructure) {
    switch (structure.type) {
      case FileType.Folder:
        return {icon: 'ic:baseline-folder', color: this.folderColor()};
      case FileType.File:
        return {icon: 'ic:round-insert-drive-file', color: this.fileColor()};
      case FileType.Asset:
        return {icon: 'ic:baseline-image', color: this.assetColor()};
    }
  }

  public getRef(id: string) {
    return this.refs[id];
  }

  private createRow(structure: FileStructure, depth: number = 0) {
    if (structure.id) {
      this.refs[structure.id] = {
        icon: null as Icon,
        txt: null as Txt,
        container: null as Rect,
      };
    }
    return (
      <Layout layout direction={'column'}>
        <Rect
          layout
          direction={'row'}
          alignItems={'center'}
          padding={() => this.rowSize() * 0.1}
          ref={
            structure.id
              ? makeRef(this.refs[structure.id], 'container')
              : undefined
          }
        >
          {depth ? <Rect width={this.indentAmount() * depth - 1} /> : null}
          <Icon
            ref={
              structure.id
                ? makeRef(this.refs[structure.id], 'icon')
                : undefined
            }
            {...this.getIconProps(structure)}
            size={() => this.rowSize() * 0.8}
            marginRight={() => this.rowSize() / 2}
          />
          <Txt
            fontSize={() => this.rowSize() * 0.6}
            fill={this.labelColor}
            ref={
              structure.id ? makeRef(this.refs[structure.id], 'txt') : undefined
            }
            text={structure.name}
          />
        </Rect>
        {structure.children?.map(child => this.createRow(child, depth + 1))}
      </Layout>
    );
  }

  public *emphasize(id: string, duration: number, modifier = 1.3) {
    const dbRefs = this.getRef(id);
    yield dbRefs.icon.size(() => this.rowSize() * 0.8 * modifier, duration);
    yield dbRefs.txt.fill(this.folderColor, duration);
    yield dbRefs.container.fill(
      new Color(Colors.Tailwind.Slate['500']).alpha(0.5),
      1,
    );
    yield* dbRefs.txt.fontSize(() => this.rowSize() * 0.6 * modifier, duration);
  }

  public *reset(id: string, duration: number) {
    const dbRefs = this.getRef(id);
    yield dbRefs.icon.size(() => this.rowSize() * 0.8, duration);
    yield dbRefs.txt.fill(this.labelColor, duration);
    yield dbRefs.container.fill(DEFAULT, 1);
    yield* dbRefs.txt.fontSize(() => this.rowSize() * 0.6, duration);
  }
}
