import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';
import tsConfigPaths from 'vite-tsconfig-paths';
import ffmpeg from '@motion-canvas/ffmpeg';

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    motionCanvas({
      project: './test/project.ts',
    }),
    ffmpeg(),
  ],
});
