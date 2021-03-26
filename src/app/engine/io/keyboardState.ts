export enum KeyState {
    PRESSED,
    RELEASED,
}

type KeyAction = (keyState: KeyState) => void;

export default class KeyboardState {
    //Hold the current states of a given key
    keyStates: { [name: string]: KeyState } = {};
    //Mapping function from key to action
    keyMap: { [name: string]: KeyAction } = {};

    addMapping(code: string, callback: KeyAction): KeyboardState {
        this.keyMap[code] = callback;
        return this;
    }

    handleEvent(event: KeyboardEvent): void {
        const { code } = event;
        if (!this.keyMap[code]) {
            return;
        }
        event.preventDefault();
        const keyState = event.type === 'keydown' ? KeyState.PRESSED : KeyState.RELEASED;
        if (this.keyStates[code] === keyState) {
            return;
        }
        this.keyStates[code] = keyState;
        this.keyMap[code](keyState);
    }

    listenTo(window: Window): void {
        ['keydown', 'keyup'].forEach(eName =>
            window.addEventListener(eName, event => this.handleEvent(event as KeyboardEvent)),
        );
    }
}
