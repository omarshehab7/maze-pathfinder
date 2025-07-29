import type { Metadata } from "next";
import { Geist, Geist_Mono,Inter,Poppins } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ['latin'] });

const poppins = Poppins({
  weight: ['400', '600', '700'], 
  subsets: ['latin'],
});


export const metadata: Metadata = {
  title: "Maze Pathfinder",
  description: "Visualize A* pathfinding",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.className}>
      <body>
        {children}
      </body>
    </html>
  );
}
