import { type MetadataJSONObject } from './common';
import { type Error } from './error';

export type PlayerStatus = 'ALIVE' | 'DEFEATED';

export type Player = {
  hp: number;
  id: string;
  metadata: MetadataJSONObject;
  name: string;
  power: number;
  status: PlayerStatus;
};

export type CreatePlayerInput = {
  hp?: number;
  metadata?: MetadataJSONObject;
  name: string;
  power: number;
};

export type CreatePlayerPayload = {
  errors: Error[];
  player: Player;
};
