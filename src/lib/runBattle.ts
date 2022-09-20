import { BattleModel } from '@/models/Battle';
import { type CreateBattleInput } from '@/types/battle';

export const runBattle = (input: CreateBattleInput) => {
  const battle = new BattleModel(input);

  // start battle
  battle.startBattle();
  while (battle.status !== 'finished') {
    battle.performTurn();
  }

  return battle;
};
