export async function runAStar(grid: string[][], start: [number, number], goal: [number, number], sendUpdate: (msg: any) => void) {
  // Simulate exploration and final path
  for (let i = 0; i < 50; i++) {
    sendUpdate({ type: 'visited', row: i % 20, col: i % 20 });
    await new Promise((res) => setTimeout(res, 30));
  }

  sendUpdate({ type: 'path', path: [[0, 0], [0, 1], [1, 1], [2, 2]] });
}