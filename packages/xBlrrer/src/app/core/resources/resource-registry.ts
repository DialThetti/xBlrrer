import { Loader } from '@dialthetti/feather-engine-core';
import { Font, FontLoader, NineWaySpriteSheet, NineWaySpriteSheetLoader } from '@dialthetti/feather-engine-graphics';

class ResourceManager {
  private resources: { [url: string]: unknown } = {};

  public async load<T>(url: string, loader: () => Loader<T>): Promise<T> {
    if (!this.resources[url]) this.resources[url] = loader().load();
    return this.resources[url] as T;
  }
}

const resourceManager = new ResourceManager();
export const ResourceRegistry = {
  frame: (): Promise<NineWaySpriteSheet> =>
    resourceManager.load('./img/frame.png', () => new NineWaySpriteSheetLoader('./img/frame.png')),
  font: (): Promise<Font> => resourceManager.load('./img/font.png', () => new FontLoader('./img/font.png')),
};
