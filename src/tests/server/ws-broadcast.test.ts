import { registerClient, broadcastProgress } from '../../server/ws-broadcast';
import { clients } from '../../server/ws-clients';

// ✅ Fix: define WebSocket.OPEN
(global as any).WebSocket = { OPEN: 1 };

describe('WebSocket broadcast and registration', () => {
  let mockSocket: any;

  beforeEach(() => {
    mockSocket = {
      send: jest.fn(),
      on: jest.fn((event, cb) => {
        if (event === 'close') {
          mockSocket._close = cb;
        }
      }),
      readyState: 1, // OPEN
    };
    clients.clear();
  });

  it('registerClient should add socket to clients', () => {
    registerClient(mockSocket);
    expect(clients.size).toBe(1);
  });

  it('registerClient should remove socket on close', () => {
    registerClient(mockSocket);
    expect(clients.size).toBe(1);
    mockSocket._close(); // Simulate connection close
    expect(clients.size).toBe(0);
  });

  it('broadcastProgress should send data to all open clients', () => {
    registerClient(mockSocket);
    const message = { type: 'test', row: 0, col: 1 };
    broadcastProgress(message);
    expect(mockSocket.send).toHaveBeenCalledWith(JSON.stringify(message));
  });

  it('broadcastProgress should skip non-open clients', () => {
    mockSocket.readyState = 3; // CLOSED
    registerClient(mockSocket);
    const message = { type: 'test', row: 0, col: 1 };
    broadcastProgress(message);
    expect(mockSocket.send).not.toHaveBeenCalled();
  });
});
