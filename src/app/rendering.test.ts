import {afterAll, beforeAll, describe, expect, test} from 'vitest';
import {App, start} from './app';

describe('Rendering', () => {
  let app: App;

  beforeAll(async () => {
    app = await start();
  });

  afterAll(async () => {
    await app.stop();
  });

  test(
    'Animation renders correctly',
    {
      timeout: 15 * 60 * 1000,
    },
    async () => {
      await app.page.evaluateHandle('document.fonts.ready');
      await new Promise(resolve => setTimeout(resolve, 5_000));
      await app.page.screenshot();
      const rendering = await app.page.waitForSelector(
        "::-p-xpath(//div[contains(text(), 'Video Settings')])",
      );
      if (rendering) {
        const tab = await app.page.evaluateHandle(
          el => el.parentElement,
          rendering,
        );
        await tab.click();
      }
      await new Promise(resolve => setTimeout(resolve, 1_000));

      const frameRateLabel = await app.page.waitForSelector(
        "::-p-xpath(//div[contains(text(), 'Rendering')]/parent::div//label[contains(text(), 'frame rate')]/parent::div//input)",
      );
      expect(frameRateLabel).toBeDefined();
      expect(frameRateLabel).toBeDefined();
      await frameRateLabel.click({clickCount: 3});
      await frameRateLabel.type('15');

      const scaleLabel = await app.page.waitForSelector(
        "::-p-xpath(//div[contains(text(), 'Rendering')]/parent::div//label[contains(text(), 'scale')])",
      );
      expect(scaleLabel).toBeDefined();
      const scale = await app.page.evaluateHandle(
        el => el.parentElement.children[1],
        scaleLabel,
      );

      await app.page.select(
        "::-p-xpath(//div[contains(text(), 'Rendering')]/parent::div//label[contains(text(), 'exporter')]/parent::div//select)",
        'Image sequence',
      );

      await scale.select('1');

      const render = await app.page.waitForSelector('#render');
      await render.click();
      await app.page.waitForSelector('#render[data-rendering="true"]', {
        timeout: 2 * 1000,
      });
      await app.page.waitForSelector('#render:not([data-rendering="true"])', {
        timeout: 15 * 60 * 1000,
      });

      expect(true).toBe(true);
    },
  );
});
