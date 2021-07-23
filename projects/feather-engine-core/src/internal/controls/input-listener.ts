import FeatherEngine from '../feather-engine';
import { GameLoop } from '../gameloop/gameloop';
import { OnInput } from '../gameloop/gameloop-listeners';
import { info } from '../logger';

export enum KeyState {
    PRESSED,
    RELEASED,
}

export interface KeyListener {
    keyDown(keyCode: string): void;
    keyUp(keyCode: string): void;
    keyPressed(keyCode: string): void;
}

export class KeyboardInput implements OnInput {
    //Hold the current states of a given key
    private keyStates: { [name: string]: KeyState } = {};
    private keyStatesChanges: { [name: string]: KeyState } = {};

    private keyListeners: KeyListener[] = [];

    private static _instance: KeyboardInput;

    private registered = false;
    private constructor() {
        // private constructor to implement Singleton Pattern

        FeatherEngine.eventBus.subscribe('game-control-input', {
            receive: (t: string, s: string) => {
                if (s === 'stash') {
                    this.stashKeyListeners();
                }
                if (s === 'pop') {
                    this.popKeyListeners();
                }
                if (s === 'clear') {
                    this.clearKeyListeners();
                }
            },
        });
    }

    private static get instance() {
        if (!KeyboardInput._instance) {
            KeyboardInput._instance = new KeyboardInput();
            GameLoop.register(KeyboardInput._instance as OnInput);
        }
        return KeyboardInput._instance;
    }

    public static addKeyListener(keyListener: KeyListener): void {
        KeyboardInput.instance.addKeyListener(keyListener);
    }

    private clearKeyListeners(): void {
        // Lift all keys
        Object.keys(KeyboardInput.instance.keyStates).forEach((k) => {
            const v = KeyboardInput.instance.keyStates[k];
            if (v == KeyState.PRESSED) {
                KeyboardInput.instance.keyListeners.forEach((l) => l.keyUp(k));
            }
        });
        KeyboardInput.instance.keyStates = {};
        KeyboardInput.instance.keyListeners.length = 0;
        KeyboardInput.instance.keyStatesChanges = {};
    }

    private static keyListenerStash: KeyListener[] = [];

    private stashKeyListeners(): void {
        KeyboardInput.keyListenerStash = [...KeyboardInput.instance.keyListeners];
        this.clearKeyListeners();
    }

    private popKeyListeners(): void {
        this.clearKeyListeners();
        KeyboardInput.instance.keyListeners = KeyboardInput.keyListenerStash;
    }
    /**
     * Not real public, since class cant be instanciated
     * @implements OnInput interface
     */
    public handleInput(): void {
        if (!this.registered) {
            this.listenTo(window);
            this.registered = true;
        }
        Object.entries(this.keyStatesChanges).forEach(([code, keyState]) => {
            if (keyState == KeyState.PRESSED) {
                this.keyListeners.forEach((l) => l.keyDown(code));
            } else {
                this.keyListeners.forEach((l) => l.keyUp(code));
            }
        });
        this.keyStatesChanges = {};
        Object.entries(this.keyStates)
            .filter(([, keyState]) => keyState === KeyState.PRESSED)
            .forEach(([code]) => {
                this.keyListeners.forEach((l) => l.keyPressed(code));
            });
    }

    private addKeyListener(keyListener: KeyListener): void {
        this.keyListeners.push(keyListener);
    }

    private handleEvent(event: KeyboardEvent): void {
        const { code, type } = event;
        const keyState = type === 'keydown' ? KeyState.PRESSED : KeyState.RELEASED;
        if (this.keyStates[code] === keyState) {
            return;
        }
        this.keyStates[code] = keyState;
        this.keyStatesChanges[code] = keyState;
    }

    private listenTo(window: Window): void {
        info(this, 'Register at window');
        ['keydown', 'keyup'].forEach((eName) => {
            window.addEventListener(eName, (event) => this.handleEvent(event as KeyboardEvent));
        });
    }
}
