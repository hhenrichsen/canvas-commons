# Canvas Commons

If you use this in your videos, I would appreciate credit via a link to this
repo, or a mention by name. I would also love to see them; feel free to show me
on the motion canvas discord (I'm `@Hunter` on there).

If you want to support the development of this and other libraries, feel free to
donate on [Ko-fi](https://ko-fi.com/hhenrichsen).

## Using this library

### From git

1. Clone this repo.
1. Run `npm install <path to this repo>` in your motion canvas project

### From npm

1. Run `npm install @hhenrichsen/canvas-commons`

## Components

### Window

The `Window` node is custom component designed to look like a window on either a
MacOS system or a Windows 98 system. It is designed to be used as a container,
and uses a `Scrollable` internally to view larger content than its size.

#### Props

- `title` - the title of the window
- `titleProps` - the props to pass to the title's `<Txt>` node
- `headerColor` - the color of the header
- `bodyColor` - the color of the body
- `windowStyle` - the style of the window, either `WindowStyle.Windows98` or
  `WindowStyle.MacOS`
- `scrollable` - the ref to the scrollable to use
- `scrollOffset` - the initial offset to use for the scrollable

#### Example

```tsx
import {Window, Scrollable, WindowStyle} from '@components';
import {makeScene2D, Rect} from '@motion-canvas/2d';
import {createRef, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const scrollable = createRef<Scrollable>();
  const rect = createRef<Rect>();
  view.add(
    <>
      <Window windowStyle={WindowStyle.Windows98} scrollable={scrollable}>
        <Rect fill={'blue'} radius={5} ref={rect} size={40}></Rect>
      </Window>
    </>,
  );

  yield* scrollable().scrollTo([150, 150], 2);
  yield* scrollable().scrollToLeft(1);
  yield* scrollable().scrollToTop(1);
  yield* scrollable().scrollTo(0, 1);
  yield* waitFor(1);

  yield rect().fill('seagreen', 1);
  yield* rect().size(600, 2);
  yield* waitFor(1);

  yield* scrollable().scrollToBottom(1);
  yield* scrollable().scrollToRight(1);
  yield* scrollable().scrollBy(-100, 1);
  yield* waitFor(5);
});
```

### FileTree

The `FileTree` node is a custom component designed to look like a file tree. It
supports highlighting and selection of files and folders.

#### Props

- `structure` - the structure of the file tree
- `folderColor` - the color of the folder icon
- `fileColor` - the color of the file icon
- `assetColor` - the color of the asset icon
- `labelColor` - the color of the label
- `indentAmount` - the amount to indent each level of the tree
- `rowSize` - the size of each row in the tree

#### Example

```tsx
import {FileTree, FileType} from '@hhenrichsen/canvas-commons';
import {makeScene2D} from '@motion-canvas/2d';
import {createRef, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const fileStructure = createRef<FileTree>();
  view.add(
    <>
      <FileTree
        rowSize={50}
        ref={fileStructure}
        structure={{
          name: '/',
          type: FileType.Folder,
          children: [
            {
              name: 'src',
              type: FileType.Folder,
              children: [
                {
                  name: 'data',
                  id: 'db',
                  type: FileType.Folder,
                  children: [
                    {
                      name: 'queries',
                      type: FileType.Folder,
                      children: [
                        {
                          name: 'userQueries.ts',
                          type: FileType.File,
                        },
                        {
                          name: 'postQueries.ts',
                          type: FileType.File,
                        },
                      ],
                    },
                    {
                      name: 'connection.ts',
                      type: FileType.File,
                    },
                  ],
                },
                {
                  name: 'model',
                  id: 'model',
                  type: FileType.Folder,
                  children: [
                    {
                      name: 'user.ts',
                      type: FileType.File,
                    },
                    {
                      name: 'post.ts',
                      type: FileType.File,
                    },
                  ],
                },
                {
                  name: 'view',
                  id: 'view',
                  type: FileType.Folder,
                  children: [
                    {
                      name: 'home.component.ts',
                      type: FileType.File,
                    },
                    {
                      name: 'profile.component.ts',
                      type: FileType.File,
                    },
                  ],
                },
              ],
            },
          ],
        }}
      ></FileTree>
    </>,
  );

  yield* fileStructure().emphasize('db', 1);
});
```

### Functional Components

I also have a collection of functional components that I use to automate using
some of these components:

- `ImgWindow` - a window that contains an image
- `Body` - a `Txt` component that wraps text
- `Title` - a `Txt` component that is bold and large
- `Em` - a `Txt` component that is emphasized
- `Bold` - a `Txt` component that is bold
- `ErrorBox` - a Windows 98-style error message
- `Windows98Button` - a button with a bevel, like in Windows 98
