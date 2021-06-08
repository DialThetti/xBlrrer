import { loadImage, loadJson } from './loaders';

interface Data {
    data: string;
}
global.fetch = (name: RequestInfo, init?: RequestInit) =>
    new Promise((success, error) => {
        if (name.toString().startsWith('error')) {
            error({ status: 404 } as Response);
        } else {
            success({ status: 200, json: () => ({ data: name } as any) } as Response);
        }
    });

global.Image.prototype.decode = () => {};
describe('loadJson', () => {
    it('should load a resource if it exists', async (done) => {
        const response = await loadJson('a');
        expect(response).toStrictEqual({ data: 'a' });
        done();
    });
    it('should log an error if file not found', async (done) => {
        const response = await loadJson('error/a');
        expect(response).toStrictEqual({});
        done();
    });
});

describe('loadImage', () => {
    it('should load a resource if it exists', async (done) => {
        const response = await loadImage('http://localhost/a');
        expect((response as HTMLImageElement).src).toBe('http://localhost/a');
        done();
    });
});
