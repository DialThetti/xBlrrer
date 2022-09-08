import { Canvas } from '../renderer/canvas-renderer';

/**
 * @deprecated use ResourceLoader
 * @param url 
 * @returns 
 */
export async function loadJson<T>(url: string): Promise<T> {
    try {
        const file = await fetch(url);
        if (file.status === 200) {
            return file.json();
        }
    } catch (error) {
        // TODO add Error Event
    }
    return {} as T;
}
/**
 * 
 * @deprecated use ResourceLoader
 * @param url 
 * @returns 
 */
export async function loadImage(url: string): Promise<Canvas> {
    const img = new Image();
    img.src = url;
    await img.decode();
    return img;
}


export class ResourceLoader {

    async loadJson<T>(url: string): Promise<T> {
        try {
            const file = await fetch(url);
            if (file.status === 200) {
                return file.json();
            }
        } catch (error) {
            // TODO add Error Event
        }
        return {} as T;
    }
    
    async loadImage(url: string): Promise<Canvas> {
        const img = new Image();
        img.src = url;
        await img.decode();
        return img;
    }
}