import { WebSocketServer } from 'ws';
import { registerClient } from './ws-broadcast.ts';
import type { Server } from 'http';

let wss: WebSocketServer | null = null;

export function __resetWSS() {
  wss = null;
}

export function initWebSocketServer(server: Server) {
  if (wss) return wss;

  wss = new WebSocketServer({ server, path: '/ws' }); // No 'upgrade' needed

  wss.on('connection', (ws) => {
  console.log('[WS] New connection');
  registerClient(ws);
  
});

  return wss;
}