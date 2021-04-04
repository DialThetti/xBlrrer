import ParallaxSpec from '../../model/ParallaxSpec';

export async function loadJson<T>(url: string): Promise<T> {
    const file = await fetch(url);
    return file.json();
}

export function loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve): void => {
        const img = new Image();
        img.addEventListener('load', (): void => {
            resolve(img);
        });
        img.src = url;
    });
}

export async function loadParallax(name: string): Promise<{ img: HTMLImageElement; y: number }> {
    const sheetSpec = await loadJson<ParallaxSpec>(`./sprites/${name}.json`);
    const img = await loadImage(sheetSpec.imageURL);
    return { img, y: sheetSpec.y };
}
