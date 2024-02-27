# My First Motion Canvas Component Library

## Using this library

### From git

1. Clone this repo.
1. Run `npm install <path to this repo>` in your motion canvas project

### From npm

1. Run `npm install <library name here>`

## Why use this repo?

This repo gives you a couple benefits over starting from scratch:

- The same linting options as main motion-canvas code, which helps to keep the
  community on the same page.
- A build pipeline in place with:
  - automatic watch support, allowing you to develop quickly
  - automatic compilation and splitting for your TypeScript, allowing it to be
    used in a variety of environments.

## Getting Started

1. Clone this repo.
1. Run
   `git remote add upstream https://github.com/hhenrichsen/motion-canvas-component-library-template`
   to gain the ability to update when this repo gets enhancements (via
   `git pull upstream main`)
1. Update the package name in `package.json` and run `npm install`. I recommend
   something like `@username/library-name`.
1. Update the UMD name of this package in `rollup.config.mjs`
1. Update the title of this README.
1. Run `npm run watch` -- this will create some files in the `lib` folder for
   you, and rebuild them here when you make changes.
1. Start developing a component in the `src` folder, and make sure that it's
   exported from the `index.ts` file.
1. Run `npm install <path to this repo>` in a motion canvas project -- this will
   add a link to this repo in your project.
1. Import components from this library and verify that they work:

```tsx
import {SwitchComponent} from '@username/library-name';
```

## Publishing to NPM

1. Run `npm run build` one last time.
1. Verify that the package works when installed with
   `npm install <path to this repo>`.
1. Run `npm publish --access public`. You may have to authenticate if this is
   your first time publishing a package.
