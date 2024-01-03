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

export type BattleSummaryStats = {
  tankiestPlayer: { player: Player; totalBlocks: number } | null;
  totalBlocked: number;
  totalDamage: number;
  totalTurns: number;
  winner: Player | null;
};

export type BattleMessage = { message: string };

export type BattleMessageLogItem = BattleMessage & { type: 'message' };

export type BattleActionLogItem = BattleAction & { type: 'turn' };

export type BattleSummaryLogItem = BattleSummaryStats & { type: 'summary' };

export type BattleLogItem =
  | BattleActionLogItem
  | BattleMessageLogItem
  | BattleSummaryLogItem;

export type BattleHooks = {
  onAction?: (action: BattleAction) => void;
  onPauseBattle?: (battle: BattleClass) => void;
  onStartBattle?: (battle: BattleClass) => void;
  onStopBattle?: (battle: BattleClass) => void;
};

export type BattleClass = {
  battleLog: BattleLogItem[];
  endTime: number;
  id: string;
  players: Player[];
  startTime: number;
  status: BattleStatus;
};

export type CreateBattleInput = {
  hooks?: BattleHooks;
  players: [Player, Player];
};

export type CreateBattlePayload = {
  battle: BattleClass;
  errors: Error[];
};
