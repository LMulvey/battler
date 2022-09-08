import { v4 } from 'uuid';
import {
  type Battle,
  type BattleAction,
  type CreateBattleInput,
} from '@/types/battle';
import { type Player } from '@/types/player';

export class BattleModel implements Battle {
  public battleLog: BattleAction[];

  public endTime: number;

  public id: string;

  public players: Player[];

  public startTime: number;

  public constructor(initialData: CreateBattleInput) {
    if (!initialData.players.length) {
      throw new Error('InvalidInput');
    }

    this.id = v4();
    this.players = initialData.players;
    this.battleLog = [];
    this.startTime = Date.now();
    this.endTime = 0;
  }

  private logAction(action: BattleAction) {
    this.battleLog.push(action);
  }

  public performTurn() {}
}
