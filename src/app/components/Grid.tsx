'use client';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

type CellType = 'free' | 'wall' | 'start' | 'goal';

const GRID_SIZE = 20;

export default function Grid() {
  const [grid, setGrid] = useState<CellType[][]>(
    Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => 'free')
    )
  );   //initialize grid 20x20 grid with initially all cells set to free
  const [startPos, setStartPos] = useState<[number, number] | null>(null);
  const [goalPos, setGoalPos] = useState<[number, number] | null>(null);
  const [pathLength, setPathLength] = useState<number | null>(null);
  const [visitedCount, setVisitedCount] = useState<number | null>(null);
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [path, setPath] = useState<Set<string>>(new Set());
  const visitedRef = React.useRef<Set<string>>(new Set());

  const handleClick = (row: number, col: number, event: React.MouseEvent) => {
    setGrid((prevGrid) => {
      //create a new grid to not mutate previous state directly
      const newGrid = prevGrid.map((r) => [...r]); //clone each row of the existing grid

      if (event.shiftKey) {
        //Set start
        if (startPos) {
          newGrid[startPos[0]][startPos[1]] = 'free';
        }
        newGrid[row][col] = 'start';
        setStartPos([row, col]);
      } else if (event.ctrlKey || event.metaKey) {
        //Set goal
        if (goalPos) {
          newGrid[goalPos[0]][goalPos[1]] = 'free';
        }
        newGrid[row][col] = 'goal';
        setGoalPos([row, col]);
      } else {
        //Toggle wall
        const cell = newGrid[row][col];
        newGrid[row][col] = cell === 'wall' ? 'free' : 'wall';
      }

      return newGrid;
    });
  };

 const handleSolve = async () => {
  //console.log('[Solve] grid size:', grid.length, grid[0]?.length);
 // console.log('[Solve] start:', startPos, 'goal:', goalPos);

  if (!startPos || !goalPos) {
    alert('Please set both a start and goal point.');
    return;
  }

  // Reset all states AND the visitedRef
  visitedRef.current = new Set();            
  setVisited(new Set());
  setPath(new Set());
  setPathLength(null);
  setVisitedCount(null);

  const response = await fetch('/api/solve', {
    method: 'POST',
    body: JSON.stringify({
      grid,
      start: startPos,
      goal: goalPos,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  await response.json();
};


const resetBoard = () => {
  setGrid(
    Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => 'free')
    )
  );
  setStartPos(null);
  setGoalPos(null);
  setVisited(new Set());
  setPath(new Set());
  setPathLength(null);
  setVisitedCount(null);
  visitedRef.current = new Set();
};




  useEffect(() => {
  const ws = new WebSocket('ws://localhost:3000/ws');

  ws.onopen = () => {
    console.log('WebSocket connected');
  };

  ws.onmessage = (event) => {
    //console.log('[WS] Message received:', event.data);
    const msg = JSON.parse(event.data);

    if (msg.type === 'visited') {
      const key = `${msg.row},${msg.col}`;
      visitedRef.current.add(key);
      setVisited(new Set(visitedRef.current)); // trigger re-render
    }

    if (msg.type === 'path') {
      //console.log('[WS] Received path:', msg.path);
      const newPath: Set<string> = new Set(
        msg.path.map(([r, c]: [number, number]) => `${r},${c}`)
      );
      setPath(newPath);
      setPathLength(newPath.size);
      setVisitedCount(visitedRef.current.size);
    }
  };

  return () => {
    ws.close();
  };
}, []);

  return (
    <>
    <div className="grid grid-cols-20 gap-[2px] p-2 rounded-xl shadow-md bg-gradient-to-br from-gray-100 to-gray-200">
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
          key={`${rowIndex}-${colIndex}`}
          className={clsx(
           'w-6 h-6 rounded-md shadow-sm transition-all duration-200 border border-gray-300 hover:scale-110',
          {
            'bg-green-500': cell === 'start',
            'bg-red-500': cell === 'goal',
            'bg-zinc-800': cell === 'wall',
            'bg-blue-500': path.has(`${rowIndex},${colIndex}`),
            'bg-yellow-300': visited.has(`${rowIndex},${colIndex}`) && !path.has(`${rowIndex},${colIndex}`),
            'bg-white': cell === 'free' && !visited.has(`${rowIndex},${colIndex}`) && !path.has(`${rowIndex},${colIndex}`)
          }
        )}

          onClick={(e) => handleClick(rowIndex, colIndex, e)}
        />
        ))
      )
      }
    </div>
    <div className="flex items-center gap-4 py-4">
      <button onClick={handleSolve} className="bg-black text-white px-4 py-1.5 rounded-lg hover:bg-zinc-800 shadow">Solve</button>
       <button onClick={resetBoard} className="bg-white text-red-600 px-4 py-1.5 border border-red-600 rounded-lg hover:bg-red-100 shadow">
    Reset
  </button>
      <div  className="text-sm ml-4 space-y-1 text-black">
          <div> Path length: {pathLength ?? '--'}</div>
          <div> Visited nodes: {visitedCount ?? '--'}</div>
        </div>
    </div>
    </>
  );
}