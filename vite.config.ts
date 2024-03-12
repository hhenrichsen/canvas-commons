import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    motionCanvas({
      project: './test/project.ts',
    }),
  ],
});
