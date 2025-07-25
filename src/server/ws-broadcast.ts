import type { WebSocket } from 'ws';

let clients = new Set<WebSocket>();

export function registerClient(ws: WebSocket) {
  clients.add(ws);
  ws.on('close', () => clients.delete(ws));
}

export function broadcastProgress(message: any) {
  const data = JSON.stringify(message);
  for (const client of clients) {
    if (client.readyState === client.OPEN) {
      client.send(data);
    }
  }
}