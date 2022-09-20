import { type Error } from './error';
import { type Player } from './player';

export type BattleStatus = 'active' | 'finished' | 'paused' | 'queued';

export type BattleAttackResult = 'attacked' | 'blocked';

export type BattleAttack = {
  actor: Player;
  damage: number;
  recipient: Player;
  result: BattleAttackResult;
};

export type BattleAction = BattleAttack;

export type Battle = {
  battleLog: BattleAction[];
  endTime: number;
  id: string;
  players: Player[];
  startTime: number;
  status: BattleStatus;
};

export type CreateBattleInput = {
  players: [Player, Player];
};

export type CreateBattlePayload = {
  battle: Battle;
  errors: Error[];
};
