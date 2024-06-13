import * as path from 'path';
import puppeteer, {Page} from 'puppeteer';
import {fileURLToPath} from 'url';
import {createServer} from 'vite';

const Root = fileURLToPath(new URL('.', import.meta.url));

export interface App {
  page: Page;
  stop: () => Promise<void>;
}

export async function start(): Promise<App> {
  const [browser, server] = await Promise.all([
    puppeteer.launch({
      headless: false,
      protocolTimeout: 15 * 60 * 1000,
    }),
    createServer({
      root: path.resolve(Root, '../../'),
      configFile: path.resolve(Root, '../../vite.config.ts'),
      server: {
        port: 9000,
      },
    }),
  ]);

  const portPromise = new Promise<number>(resolve => {
    server.httpServer.once('listening', async () => {
      const port = (server.httpServer.address() as any).port;
      resolve(port);
    });
  });
  await server.listen();
  const port = await portPromise;
  const page = await browser.newPage();
  await page.goto(`http://localhost:${port}`, {
    waitUntil: 'networkidle0',
  });

  return {
    page,
    async stop() {
      await Promise.all([browser.close(), server.close()]);
    },
  };
}
