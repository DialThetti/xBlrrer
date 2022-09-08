import { LocalStorageSaveDataSystem } from './save-data-manager';
import { SaveDataMarshaller } from './save-data-marshaller';

class TestMarshaller implements SaveDataMarshaller<{ a: string }> {
    marshal(a: { a: string }): string {
        return a.a;
    }
    unmarshal(a: string): { a: string } {
        return { a };
    }
}

describe('LocalStorageSaveDataSystem', () => {
    const sav = new LocalStorageSaveDataSystem<{ a: string }>(new TestMarshaller());
    let store = '';
    beforeEach(() => {
        sav['storage'] = {
            setItem: (a: string, data: string) => (store = data),
            getItem: (a: string) => store,
        } as unknown as Storage;
        sav.clearData();
    });
    it('should be able to store data in storage', () => {
        sav['currentData'] = { a: 'data' };
        sav.storeCurrentData(0);
        expect(store).toBe('data');
    });
    it('should be able to load data from storage', () => {
        store = 'b';
        sav.loadCurrentData(0);
        expect(sav.getData()).toStrictEqual({ a: 'b' });
    });
    it('should be able to clear data from storage', () => {
        sav['currentData'] = { a: 'data' };
        sav.clearData();
        expect(sav.getData()).toStrictEqual({});
    });
    it('should be able to push data to storage', () => {
        sav.pushData({ a: 'c' });
        expect(sav.getData()).toStrictEqual({ a: 'c' });
    });
});
