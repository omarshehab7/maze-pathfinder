import { WebSocketServer } from 'ws';
import { registerClient } from './ws-broadcast';
import type { Server } from 'http';

let wss: WebSocketServer | null = null;

export function initWebSocketServer(server: Server) {
  if (wss) return wss;

  wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('Client connected');
    registerClient(ws);
  });

  return wss;
}
