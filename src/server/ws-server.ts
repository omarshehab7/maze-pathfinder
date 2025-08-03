import { WebSocketServer } from 'ws';
import type { Server } from 'http';
import { clients } from './ws-clients.ts';
import type { WebSocket } from 'ws';


export function registerClient(ws: WebSocket) {
  clients.add(ws);
  console.log(`[WS] Client registered. Total: ${clients.size}`);
  ws.on('close', () => {
    clients.delete(ws);
    console.log(`[WS] Client disconnected. Total: ${clients.size}`);
  });
}

let wss: WebSocketServer | null = null;

export function __resetWSS() {
  wss = null;
}

export function initWebSocketServer(server: Server) {
  if (wss) return wss;

  wss = new WebSocketServer({ server, path: '/ws' }); 

  wss.on('connection', (ws) => {
  console.log('[WS] New connection');
  registerClient(ws);
  
});

  return wss;
}