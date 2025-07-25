import { WebSocketServer } from 'ws';
import type { Server } from 'http';

let wss: WebSocketServer | null = null;

export function initWebSocketServer(server: Server) {
  if (wss) return wss; // prevent re-creation

  wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (msg) => {
      console.log('Received:', msg.toString());
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  return wss;
}
