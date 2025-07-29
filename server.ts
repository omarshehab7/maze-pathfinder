import { createServer } from 'http';
import next from 'next';
import { initWebSocketServer } from './src/server/ws-server.ts';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  initWebSocketServer(server); 

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
});