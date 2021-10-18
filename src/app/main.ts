import Game from '@game/game';
import {getAnalytics}  from './core/analytics/analytics_connetor';

declare const window: any; // eslint-disable-line

async function start(): Promise<void> {
    const game = new Game('screen');
    await game.start();
}

getAnalytics().init();
start();

