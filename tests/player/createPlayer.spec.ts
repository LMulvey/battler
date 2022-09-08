import { createPlayer } from '@/lib/createPlayer';

describe('CreatePlayer', () => {
  it('should create a player with all valid attributes', () => {
    const newPlayer = createPlayer({ name: 'player1', power: 5 });
    expect(newPlayer.errors).toHaveLength(0);
    expect(newPlayer.player.name).toEqual('player1');
  });
});
