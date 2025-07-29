Maze Pathfinder
A modern maze pathfinding visualization tool built with Next.js, TypeScript, and WebSockets.
Visualizes algorithms like A* in real-time, showing visited nodes and the shortest path between a start and goal cell.

Features
  - Interactive 20x20 grid with:
  
  - Start (Green), Goal (Red), Walls (Black), Free cells (White)
  
  - Path visualization (Blue) and visited nodes (Yellow)
  
  - A* algorithm for pathfinding
  
  - Real-time WebSocket updates
  
  - Modern Poppins font UI with TailwindCSS
  
  - Supports resetting and solving the maze


Controls
  - Shift + Left Click → Set Start Cell (Green)
  
  - Ctrl / Cmd + Left Click → Set Goal Cell (Red)
  
  - Left Click → Toggle Wall / Free Cell
  
  - Solve button → Runs the A* pathfinding algorithm
  
  - Reset button → Clears the board and all states

    
Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/maze-pathfinder.git
cd maze-pathfinder
```
2. Install dependencies:

```bash
npm install
```
2. (Optional) Install Jest for running tests:

```bash
npm install --save-dev jest @types/jest ts-jest
npm test
```
3. Run Locally:

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
