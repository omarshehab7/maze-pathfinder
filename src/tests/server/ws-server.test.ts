import { initWebSocketServer } from '../../server/ws-server';
import { registerClient } from '../../server/ws-broadcast';
import { WebSocketServer } from 'ws';
import type { Server } from 'http';
import { __resetWSS } from '../../server/ws-server';

// Shared mock instance
const mockWSS = {
  on: jest.fn(),
};

jest.mock('ws', () => {
  return {
    WebSocketServer: jest.fn(() => mockWSS),
  };
});

jest.mock('../../server/ws-broadcast', () => ({
  registerClient: jest.fn(),
}));

describe('initWebSocketServer', () => {
  const mockServer = {
    on: jest.fn(),
  } as unknown as Server;

  beforeEach(() => {
  __resetWSS();
  jest.resetModules(); // resets cached singleton wss

  const MockedWebSocketServer = WebSocketServer as unknown as jest.Mock;
  MockedWebSocketServer.mockClear();
  mockWSS.on.mockClear();
  (registerClient as jest.Mock).mockClear();
});


  it('should initialize WebSocketServer and register connection listener', () => {
    const wss = initWebSocketServer(mockServer);

    expect(WebSocketServer).toHaveBeenCalledWith({
      server: mockServer,
      path: '/ws',
    });

    expect(mockWSS.on).toHaveBeenCalledWith('connection', expect.any(Function));
    expect(wss).toBe(mockWSS);
  });

  it('should return the same instance if already initialized', () => {
    const first = initWebSocketServer(mockServer);
    const second = initWebSocketServer(mockServer);

    expect(second).toBe(first);
    expect(WebSocketServer).toHaveBeenCalledTimes(1); // constructor only once
  });
});
