import Game from './xblrrer/game';

declare const window: any; // eslint-disable-line

async function start(): Promise<void> {
    const game = new Game('screen');
    await game.start();
}
start();
