type Coord = [number, number];

export function heuristic(a: Coord, b: Coord): number {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

export function getNeighbors([row, col]: Coord, grid: string[][]): Coord[] {
  const directions = [
    [0, 1], [1, 0], [0, -1], [-1, 0]
  ];
  return directions
    .map(([dr, dc]) => [row + dr, col + dc] as Coord)
    .filter(([r, c]) =>
      r >= 0 && c >= 0 &&
      r < grid.length &&
      c < grid[0].length &&
      grid[r][c] !== 'wall'
    );
}

export async function runAStar(
  grid: string[][],
  start: Coord,
  goal: Coord,
  sendUpdate: (msg: any) => void
): Promise<void> {
  const openSet = new Set<string>();
  const cameFrom = new Map<string, Coord>();
  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();

  const key = ([r, c]: Coord) => `${r},${c}`;
  const parse = (s: string): Coord => s.split(',').map(Number) as Coord;

  openSet.add(key(start));
  gScore.set(key(start), 0);
  fScore.set(key(start), heuristic(start, goal));

  while (openSet.size > 0) {
    // Pick node with lowest fScore
    let currentKey: string | null = null;
    let lowestF = Infinity;

    for (const k of openSet) {
      const f = fScore.get(k) ?? Infinity;
      if (f < lowestF) {
        lowestF = f;
        currentKey = k;
      }
    }

    if (!currentKey) break;
    const current = parse(currentKey);

    sendUpdate({ type: 'visited', row: current[0], col: current[1] });
    await new Promise((res) => setTimeout(res, 10));

    if (currentKey === key(goal)) {
      // Reconstruct path
      const path: Coord[] = [];
      let node = current;
      while (key(node) !== key(start)) {
        path.push(node);
        node = cameFrom.get(key(node))!;
      }
      path.push(start);
      path.reverse();

      sendUpdate({ type: 'path', path });
      //console.log('[A*] ✅ Path found:', path);
      return;
    }

    openSet.delete(currentKey);

    for (const neighbor of getNeighbors(current, grid)) {
      const neighborKey = key(neighbor);
      const tentativeG = (gScore.get(currentKey) ?? Infinity) + 1;

      if (tentativeG < (gScore.get(neighborKey) ?? Infinity)) {
        cameFrom.set(neighborKey, current);
        gScore.set(neighborKey, tentativeG);
        fScore.set(neighborKey, tentativeG + heuristic(neighbor, goal));
        openSet.add(neighborKey);
      }
    }
  }

  //console.log('[A*] ❌ No path found');
  sendUpdate({ type: 'path', path: [] });
}
