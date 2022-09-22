import { v4 } from 'uuid';
import {
  type BattleHooks,
  type BattleStatus,
  type Battle,
  type BattleAction,
  type CreateBattleInput,
} from '@/types/battle';
import { type Player } from '@/types/player';

export class BattleModel implements Battle {
  public battleLog: BattleAction[];

  public endTime: number;

  public id: string;

  public players: [Player, Player];

  public startTime: number;

  public status: BattleStatus;

  private readonly actingPlayer: Player;

  private readonly defendingPlayer: Player;

  private readonly hooks: BattleHooks;

  public constructor(initialData: CreateBattleInput) {
    if (!initialData.players.length) {
      throw new Error('InvalidInput');
    }

    this.id = v4();
    this.players = initialData.players;
    this.battleLog = [];
    this.startTime = 0;
    this.endTime = 0;
    this.status = 'queued';
    this.hooks = initialData.hooks ?? {};
    // TODO: determine first player differently
    this.actingPlayer = this.players[0];
    this.defendingPlayer = this.players[1];
  }

  private logAction(action: Pick<BattleAction, 'damage' | 'result'>) {
    const resolvedAction = {
      actor: Object.assign({}, this.actingPlayer),
      recipient: Object.assign({}, this.defendingPlayer),
      ...action,
    };
    this.battleLog.push(resolvedAction);
    this.hooks.onAction?.(resolvedAction);
  }

  private calculateDamage(basePower: number) {
    const criticalDamageMultiplier = Math.random() * 5;
    return Math.floor(basePower * criticalDamageMultiplier);
  }

  private calculateDefended(basePower: number) {
    const chance = basePower * (Math.random() * 20);
    return chance % 3 === 0;
  }

  public startBattle() {
    this.startTime = Date.now();
    this.status = 'active';
    this.hooks.onStartBattle?.(this);
  }

  public pauseBattle() {
    this.status = 'paused';
    this.hooks.onPauseBattle?.(this);
  }

  public unPauseBattle() {
    this.status = 'active';
    this.hooks.onStartBattle?.(this);
  }

  public finishBattle() {
    this.endTime = Date.now();
    this.status = 'finished';
    this.hooks.onStopBattle?.(this);
  }

  public checkStatus() {
    if (this.players.some((player) => player.status === 'DEFEATED')) {
      this.finishBattle();
    }
  }

  public performTurn() {
    const didDefend = this.calculateDefended(this.defendingPlayer.power);

    if (didDefend) {
      this.logAction({ damage: 0, result: 'blocked' });
    } else {
      const damage = this.calculateDamage(this.actingPlayer.power);
      this.defendingPlayer.takeDamage(damage);
      this.logAction({ damage, result: 'attacked' });
    }

    this.checkStatus();
  }
}
