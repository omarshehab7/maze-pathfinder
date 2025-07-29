// a-star.test.ts
import { runAStar, heuristic,getNeighbors } from '@/lib/a-star';

// Re-exported from same file or defined locally for testability

type Coord = [number, number];

describe('A* Helper Functions', () => {
  test('heuristic returns Manhattan distance', () => {
    expect(heuristic([0, 0], [3, 4])).toBe(7);
    expect(heuristic([2, 5], [2, 5])).toBe(0);
  });

  test('getNeighbors returns only free neighbors', () => {
    const grid = [
      ['free', 'wall', 'free'],
      ['free', 'free', 'free'],
      ['wall', 'free', 'wall']
    ];

    const neighbors = getNeighbors([1, 1], grid);
    expect(neighbors).toEqual(
      expect.arrayContaining([
        [1, 2], // right
        [2, 1], // down
        [1, 0], // left
        [0, 1]  // up — should be skipped (wall)
      ].filter(([r, c]) => grid[r][c] !== 'wall'))
    );
  });
});

describe('runAStar', () => {
  test('finds path in open grid', async () => {
    const grid = Array.from({ length: 5 }, () => Array(5).fill('free'));
    const start: Coord = [0, 0];
    const goal: Coord = [0, 4];

    const updates: any[] = [];
    const sendUpdate = (msg: any) => updates.push(msg);

    await runAStar(grid, start, goal, sendUpdate);

    const pathUpdate = updates.find((u) => u.type === 'path');
    expect(pathUpdate).toBeDefined();
    expect(pathUpdate.path[0]).toEqual(start);
    expect(pathUpdate.path.at(-1)).toEqual(goal);
  });

  test('returns empty path when no route exists', async () => {
    const grid = [
      ['free', 'wall', 'free'],
      ['wall', 'wall', 'free'],
      ['free', 'free', 'free']
    ];
    const start: Coord = [0, 0];
    const goal: Coord = [0, 2];

    const updates: any[] = [];
    await runAStar(grid, start, goal, (msg) => updates.push(msg));

    const final = updates.find((u) => u.type === 'path');
    expect(final).toBeDefined();
    expect(final.path).toEqual([]);
  });
});
