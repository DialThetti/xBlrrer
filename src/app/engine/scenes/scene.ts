import { RenderContext } from '@dialthetti/feather-engine-core';
export default interface Scene {
    name: string;
    isLoadingScene: boolean;

    load(): Promise<void>;

    start(): Promise<void>;
    update(deltaTime: number): void;
    draw(context: RenderContext): void;
}
