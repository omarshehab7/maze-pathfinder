import { clients } from './ws-clients.ts';

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