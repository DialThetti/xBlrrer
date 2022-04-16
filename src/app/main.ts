import Game from '@game/game';

const start: () => Promise<void> = async () => {
  const game = new Game('screen');
  await game.start();
};

start();
