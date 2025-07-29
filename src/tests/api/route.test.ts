import { POST } from '../../app/api/solve/route'; // adjust path to route.ts
import type { NextRequest } from 'next/server';
import { runAStar } from '@/lib/a-star.ts';
import { broadcastProgress } from '@/server/ws-broadcast';

jest.mock('@/lib/a-star', () => ({
  runAStar: jest.fn(async (_grid, _start, _goal, sendUpdate) => {
    // Simulate sending a few updates
    sendUpdate({ type: 'visited', row: 0, col: 0 });
    sendUpdate({ type: 'path', path: [[0, 0], [1, 1]] });
  }),
}));

jest.mock('@/server/ws-broadcast.ts', () => ({
  broadcastProgress: jest.fn(),
}));

const createMockRequest = (body: any): NextRequest =>
  new Request('http://localhost/api/solve', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  }) as unknown as NextRequest;

describe('POST /api/solve', () => {
  const baseGrid = Array.from({ length: 5 }, () => Array(5).fill('free'));

  it('returns 200 and runs A* on valid input', async () => {
    const req = createMockRequest({
      grid: baseGrid,
      start: [0, 0],
      goal: [0, 1],
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.status).toBe('done');
    expect(runAStar).toHaveBeenCalled();
    expect(broadcastProgress).toHaveBeenCalled();
  });

  it('returns 400 if grid/start/goal is missing', async () => {
    const req = createMockRequest({}); // empty body
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('Missing grid, start, or goal');
  });

  it('returns 400 if start is in a wall', async () => {
    const grid = [...baseGrid];
    grid[0][0] = 'wall';

    const req = createMockRequest({
      grid,
      start: [0, 0],
      goal: [0, 1],
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('Start or goal in wall');
  });

  it('returns 400 if goal is in a wall', async () => {
    const grid = [...baseGrid];
    grid[0][1] = 'wall';

    const req = createMockRequest({
      grid,
      start: [0, 0],
      goal: [0, 1],
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('Start or goal in wall');
  });
});
