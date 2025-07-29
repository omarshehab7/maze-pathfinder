import { NextRequest, NextResponse } from 'next/server';
import { broadcastProgress } from '@/server/ws-broadcast.ts';
import { runAStar } from '@/lib/a-star.ts';


export async function POST(req: NextRequest) {
  const body = await req.json();
  const { grid, start, goal } = body;

  if (!grid || !start || !goal) {
    return NextResponse.json({ error: 'Missing grid, start, or goal' }, { status: 400 });
  }

  //  Deep clone to avoid mutating state
  const clonedGrid = grid.map((row: string[]) => [...row]);

  //  Normalize start and goal
  if (clonedGrid[start[0]][start[1]] === 'start') clonedGrid[start[0]][start[1]] = 'free';
  if (clonedGrid[goal[0]][goal[1]] === 'goal') clonedGrid[goal[0]][goal[1]] = 'free';

  //  Clean up stray markers
  for (let r = 0; r < clonedGrid.length; r++) {
    for (let c = 0; c < clonedGrid[0].length; c++) {
      if (clonedGrid[r][c] === 'start' || clonedGrid[r][c] === 'goal') {
        clonedGrid[r][c] = 'free';
      }
    }
  }

  // Debug info
  // console.log('[API] received grid:', clonedGrid.length, clonedGrid[0]?.length);
  // console.log('[API] start:', start, 'goal:', goal);
  // console.log('[A*] Start cell:', clonedGrid[start[0]][start[1]]);
  // console.log('[A*] Goal cell:', clonedGrid[goal[0]][goal[1]]);

  // 🚫 Wall check
  if (
    clonedGrid[start[0]][start[1]] === 'wall' ||
    clonedGrid[goal[0]][goal[1]] === 'wall'
  ) {
    //console.warn('[API] Start or goal is inside a wall. Aborting.');
    return NextResponse.json({ error: 'Start or goal in wall' }, { status: 400 });
  }

  await runAStar(clonedGrid, start, goal, (update) => {
    broadcastProgress(update);
  });

  return NextResponse.json({ status: 'done' });
}
