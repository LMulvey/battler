import { v4 } from 'uuid';
import {
  type BattleMessageLogItem,
  type BattleActionLogItem,
  type BattleSummaryLogItem,
  type BattleLogItem,
  type BattleHooks,
  type BattleStatus,
  type BattleClass,
  type BattleAction,
  type CreateBattleInput,
} from '@/types/battle';
import { type Player } from '@/types/player';

export class Battle implements BattleClass {
  public battleLog: BattleLogItem[];

  public endTime: number;

  public id: string;

  public players: [Player, Player];

  public startTime: number;

  public status: BattleStatus;

  public winner: Player | null;

  private actingPlayer: Player;

  private defendingPlayer: Player;

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
    this.winner = null;

    // Temporarily assign players to these variables
    // The actual starting player is determined in #determinePlayerOrder
    this.actingPlayer = this.players[0];
    this.defendingPlayer = this.players[1];
    this.determinePlayerOrder();
  }

  private determinePlayerOrder() {
    const randomIndex = Math.floor(Math.random() * this.players.length);

    for (let index = 0; index < this.players.length; index++) {
      const player = this.players[index];
      // This shouldn't happen
      if (!player) {
        continue;
      }

      if (index === randomIndex) {
        this.actingPlayer = player;
      } else {
        this.defendingPlayer = player;
      }
    }

    this.logMessage(`${this.actingPlayer.name} goes first.`);
  }

  private logAction(action: Pick<BattleAction, 'damage' | 'result'>) {
    const resolvedAction: BattleActionLogItem = {
      actor: Object.assign({}, this.actingPlayer),
      recipient: Object.assign({}, this.defendingPlayer),
      type: 'turn',
      ...action,
    };

    this.battleLog.push(resolvedAction);
    this.hooks.onAction?.(resolvedAction);
  }

  private logMessage(message: string) {
    const resolvedMessage: BattleMessageLogItem = {
      message,
      type: 'message',
    };

    this.battleLog.push(resolvedMessage);
  }

  private calculateDamage(basePower: number) {
    const criticalDamageMultiplier = Math.random() * 8;
    return Math.floor(basePower * criticalDamageMultiplier);
  }

  private determineDefended(basePower: number) {
    const chance = Math.floor(basePower * (Math.random() * 21));
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
    this.winner =
      this.players.find((player) => player.status === 'ALIVE') ?? null;

    this.buildStats();
    this.hooks.onStopBattle?.(this);
  }

  public swapTurns() {
    const currentActingPlayer = this.actingPlayer;
    const currentDefendingPlayer = this.defendingPlayer;
    this.actingPlayer = currentDefendingPlayer;
    this.defendingPlayer = currentActingPlayer;
  }

  public checkStatus() {
    if (this.players.some((player) => player.status === 'DEFEATED')) {
      this.finishBattle();
    }
  }

  private isBattleActionLogItem(
    action: BattleLogItem
  ): action is BattleActionLogItem {
    return action.type === 'turn';
  }

  public fetchLogSummary() {
    return this.battleLog.filter((action) => action.type === 'summary');
  }

  private buildStats() {
    const battleLogActions = this.battleLog.filter(
      (action): action is BattleActionLogItem =>
        this.isBattleActionLogItem(action)
    );
    const totalTurns = battleLogActions.length;
    const totalDamage = battleLogActions.reduce(
      (accumulator, action) => accumulator + action.damage,
      0
    );
    const blocks = battleLogActions.filter(
      (action) => action.result === 'blocked'
    );
    const totalBlocked = blocks.length;
    const blocksByPlayer = blocks.reduce<{ [key: string]: number }>(
      (accumulator, action) => {
        const player = action.actor.id;
        if (!accumulator[player]) {
          accumulator[player] = 0;
        }

        accumulator[player] += 1;
        return accumulator;
      },
      {}
    );

    const playerIdWithMostBlocks = Object.keys(blocksByPlayer).reduce(
      (accumulator, playerId) => {
        const currentPlayer = blocksByPlayer[playerId];
        const currentTopPlayer = blocksByPlayer[accumulator];

        if (!currentTopPlayer) {
          return playerId;
        }

        if (currentPlayer && currentPlayer > currentTopPlayer) {
          return playerId;
        }

        return accumulator;
      },
      ''
    );

    const tankiestPlayer = this.players.find(
      (player) => player.id === playerIdWithMostBlocks
    );

    const stats: BattleSummaryLogItem = {
      tankiestPlayer: tankiestPlayer
        ? {
            player: tankiestPlayer,
            totalBlocks: blocksByPlayer[playerIdWithMostBlocks] ?? 0,
          }
        : null,
      totalBlocked,
      totalDamage,
      totalTurns,
      type: 'summary',
      winner: this.winner,
    };

    this.battleLog.push(stats);
  }

  public performTurn() {
    const didDefend = this.determineDefended(this.defendingPlayer.power);

    if (didDefend) {
      this.logAction({ damage: 0, result: 'blocked' });
    } else {
      const damage = this.calculateDamage(this.actingPlayer.power);
      this.defendingPlayer.takeDamage(damage);
      this.logAction({ damage, result: 'attacked' });
    }

    this.checkStatus();
    this.swapTurns();
  }
}
