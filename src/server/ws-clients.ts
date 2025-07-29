import type { WebSocket } from 'ws';

declare global {
  var wsClients: Set<WebSocket> | undefined;
}

export const clients: Set<WebSocket> =
  globalThis.wsClients || new Set<WebSocket>();

if (!globalThis.wsClients) {
  globalThis.wsClients = clients;
}