import Image from "next/image";
import Grid from './components/Grid';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200  flex flex-col items-center justify-center px-6  font-sans">
  <h1 className="text-4xl font-semibold tracking-tight  py-3 text-center text-black">Maze Pathfinder</h1>
      <Grid />
    </main>
  );
}
