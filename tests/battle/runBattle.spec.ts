import { createPlayer } from '@/lib/createPlayer';
import { runBattle } from '@/lib/runBattle';

describe('RunBattle', () => {
  it('runs a valid battle', () => {
    const player1 = createPlayer({ name: 'player1', power: 5 });
    const player2 = createPlayer({ name: 'player2', power: 10 });
    const battle = runBattle({ players: [player1.player, player2.player] });

    expect(battle.battleLog.length > 0).toBeTruthy();
  });
});
