import { SaveDataMarshaller } from './save-data-marshaller';

export abstract class SaveDataSystem<T> {
    protected currentData: T = {} as T;

    constructor(protected marshaller: SaveDataMarshaller<T>) {}
    /**
     * Load data from a storage to the current game
     * @param slot
     */
    abstract loadCurrentData(slot: number): void;
    /**
     * Write the current game data into a storage
     * @param slot
     */
    abstract storeCurrentData(slot: number): void;
    /**
     * Add a `Partial`of the SaveData to current game state
     * @param data
     */
    public pushData(data: Partial<T>) {
        this.currentData = { ...this.currentData, ...data };
    }
    /**
     * Keeps track of the current game state, with all data which should be written into a save data
     */
    public getData(): T {
        return this.currentData as T;
    }
    /**
     * Clear all data of the current game State
     */
    public clearData(): void {
        this.currentData = {} as T;
    }
}
export class LocalStorageSaveDataSystem<T> extends SaveDataSystem<T> {
    //Indirection for test
    private storage: Storage = localStorage;

    public loadCurrentData(slot: number): void {
        const dataString = this.storage.getItem('save_' + slot);
        if (dataString === null) {
            this.currentData = {} as T;
            return;
        }
        this.currentData = this.marshaller.unmarshal(dataString);
    }
    public storeCurrentData(slot: number): void {
        const dataString = this.marshaller.marshal(this.currentData);
        this.storage.setItem('save_' + slot, dataString);
    }
}
