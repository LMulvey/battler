import { type Battle } from '@/models/Battle';

export const runBattle = (battle: Battle): void => {
  // start battle
  battle.startBattle();
  while (battle.status !== 'finished') {
    battle.performTurn();
  }
};
