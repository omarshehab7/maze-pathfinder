'use client';

import React, { useState } from 'react';
import clsx from 'clsx';

type CellType = 'free' | 'wall' | 'start' | 'goal';

const GRID_SIZE = 20;

export default function Grid() {
  const [grid, setGrid] = useState<CellType[][]>(
    Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => 'free')
    )
  );

  const [startPos, setStartPos] = useState<[number, number] | null>(null);
  const [goalPos, setGoalPos] = useState<[number, number] | null>(null);
  const [pathLength, setPathLength] = useState<number | null>(null);
  const [visitedCount, setVisitedCount] = useState<number | null>(null);

  const handleClick = (row: number, col: number, event: React.MouseEvent) => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((r) => [...r]);

      if (event.shiftKey) {
        // Set start
        if (startPos) {
          newGrid[startPos[0]][startPos[1]] = 'free';
        }
        newGrid[row][col] = 'start';
        setStartPos([row, col]);
      } else if (event.ctrlKey || event.metaKey) {
        // Set goal
        if (goalPos) {
          newGrid[goalPos[0]][goalPos[1]] = 'free';
        }
        newGrid[row][col] = 'goal';
        setGoalPos([row, col]);
      } else {
        // Toggle wall
        const cell = newGrid[row][col];
        newGrid[row][col] = cell === 'wall' ? 'free' : 'wall';
      }

      return newGrid;
    });
  };

  const handleSolve = () => {
    
      if(!startPos || !goalPos){
        alert('Please enter both start and goal points');
        return;
      }

     

      // 🔧 Placeholder logic – to be replaced with actual pathfinding
    setPathLength(42); // pretend result
    setVisitedCount(87); // pretend result
  }

  return (
    <>
    <div className="grid grid-cols-20 gap-[1px] bg-gray-300 max-w-fit">
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={clsx(
              'w-6 h-6 border border-gray-200',
              {
                'bg-white': cell === 'free',
                'bg-black': cell === 'wall',
                'bg-green-500': cell === 'start',
                'bg-red-500': cell === 'goal',
              }
            )}
            onClick={(e) => handleClick(rowIndex, colIndex, e)}
          />
        ))
      )}
    </div>
    <div className='justify-center items-center py-4'>
      <button onClick={handleSolve}>Solve</button>
      <div className="text-sm py-2">
          <div>📏 Path length: {pathLength ?? '--'}</div>
          <div>🧠 Visited nodes: {visitedCount ?? '--'}</div>
        </div>
    </div>
    </>
  );
}