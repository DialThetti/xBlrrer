import { loadImage, loadJson } from './loaders';

interface Data {
  data: string;
}
global.fetch = (name: RequestInfo | URL, init?: RequestInit) =>
  new Promise((success, error) => {
    if (name.toString().startsWith('error')) {
      error({ status: 404 } as Response);
    } else {
      success({ status: 200, json: () => ({ data: name } as any) } as Response);
    }
  });

// eslint-disable-next-line @typescript-eslint/no-empty-function
global.Image.prototype.decode = () => {};
describe('loadJson', () => {
  it('should load a resource if it exists', async () => {
    const response = await loadJson('a');
    expect(response).toStrictEqual({ data: 'a' });
  });
  it('should log an error if file not found', async () => {
    const response = await loadJson('error/a');
    expect(response).toStrictEqual({});
  });
});

describe('loadImage', () => {
  it('should load a resource if it exists', async () => {
    const response = await loadImage('http://localhost/a');
    expect((response as HTMLImageElement).src).toBe('http://localhost/a');
  });
});
