import { createPlayer } from '@/lib/createPlayer';
import { runBattle } from '@/lib/runBattle';

describe('RunBattle', () => {
  it('runs a valid battle', () => {
    const player1 = createPlayer({ name: 'player1', power: 5 });
    const player2 = createPlayer({ name: 'player2', power: 5 });
    const battle = runBattle({ players: [player1.player, player2.player] });

    expect(battle.battleLog.length > 0).toBeTruthy();
    expect(battle.winner).toBeDefined();
  });

  it('executes hooks during battle', () => {
    const onAction = jest.fn();
    const onStartBattle = jest.fn();
    const onStopBattle = jest.fn();

    const player1 = createPlayer({ name: 'player1', power: 5 });
    const player2 = createPlayer({ name: 'player2', power: 5 });
    const battle = runBattle({
      hooks: {
        onAction,
        onStartBattle,
        onStopBattle,
      },
      players: [player1.player, player2.player],
    });

    expect(battle.battleLog.length > 0).toBeTruthy();
    expect(onAction).toHaveBeenCalled();
    expect(onStartBattle).toHaveBeenCalledTimes(1);
    expect(onStopBattle).toHaveBeenCalledTimes(1);
  });
});
