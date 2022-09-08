import { v4 } from 'uuid';
import { type MetadataJSONObject } from '@/types/common';
import {
  type CreatePlayerInput,
  type Player,
  type PlayerStatus,
} from '@/types/player';

const DEFAULT_HP = 100;

export class PlayerModel implements Player {
  public id: string;

  public name: string;

  public power: number;

  public hp: number;

  public metadata: MetadataJSONObject;

  public status: PlayerStatus;

  public constructor(initialData: CreatePlayerInput) {
    this.id = v4();
    this.name = initialData.name;
    this.power = initialData.power;
    this.hp = initialData.hp ?? DEFAULT_HP;
    this.metadata = initialData.metadata ?? {};
    this.status = 'ALIVE';
  }

  private updateStatus() {
    if (this.hp <= 0) {
      this.status = 'DEFEATED';
    }
  }

  public takeDamage(damageAmount: number) {
    this.hp -= damageAmount;
    this.updateStatus();
  }
}
