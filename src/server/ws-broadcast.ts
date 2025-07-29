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

export function broadcastProgress(message: any) {
  const data = JSON.stringify(message);
  // console.log('[WS] Broadcasting:', data);
  // console.log('[WS] Clients count:', clients.size);

  for (const client of clients) {
    if (client.readyState === (globalThis.WebSocket?.OPEN ?? 1)) {
      try {
        client.send(data);
      } catch (err) {
        console.error('WebSocket send error:', err);
      }
    }
  }
}