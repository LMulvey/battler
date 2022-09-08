import { PlayerModel } from '@/models/Player';
import {
  type CreatePlayerInput,
  type CreatePlayerPayload,
} from '@/types/player';

export const createPlayer = (input: CreatePlayerInput): CreatePlayerPayload => {
  const createdPlayer = new PlayerModel(input);
  return {
    errors: [],
    player: createdPlayer,
  };
};
