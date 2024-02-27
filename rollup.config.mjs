import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import externals from 'rollup-plugin-node-externals';
import terser from '@rollup/plugin-terser';

/** @type {import('rollup').RollupOptions} */
const config = [
  {
    input: 'src/index.ts',
    output: {
      file: 'lib/index.min.js',
      format: 'es',
    },
    plugins: [externals(), typescript(), terser()],
    external: [/^@motion-canvas\/core/, /^@motion-canvas\/2d/],
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'lib/index.js',
      format: 'es',
    },
    plugins: [externals(), typescript()],
    external: [/^@motion-canvas\/core/, /^@motion-canvas\/2d/],
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'lib/index.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
];

export default config;
