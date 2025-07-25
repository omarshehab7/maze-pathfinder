import { NextRequest, NextResponse } from 'next/server';
import { broadcastProgress } from '@/server/ws-broadcast';
import { runAStar } from '@/lib/a-star';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { grid, start, goal } = body;

  if (!grid || !start || !goal) {
    return NextResponse.json({ error: 'Missing grid, start, or goal' }, { status: 400 });
  }

  // Run A* algorithm (step-by-step)
  await runAStar(grid, start, goal, (update) => {
    broadcastProgress(update); // Send progress over WebSocket
  });

  return NextResponse.json({ status: 'done' });
}