import Image from "next/image";
import Grid from './components/Grid';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-4">Maze Pathfinder</h1>
      <Grid />
    </main>
  );
}
