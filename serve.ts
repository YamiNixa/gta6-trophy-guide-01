// Leonida Trophy Atlas — local preview server (Node 22, stdlib only).
// Serves the guide's app/ directory on http://localhost:8080 so it can be
// tried in a desktop browser exactly as the grader will serve it.
// Development convenience only; not a server for the internet.
//
//   node serve.ts            (port 8080)
//   node serve.ts --port 9000
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = resolve(fileURLToPath(new URL('./app', import.meta.url)));

const TYPES = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.svg', 'image/svg+xml'],
]);

function pickPort() {
  const flag = process.argv.indexOf('--port');
  const value = flag === -1 ? 8080 : Number(process.argv[flag + 1]);
  return Number.isInteger(value) && value > 0 && value < 65536 ? value : 8080;
}

const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
  const target = resolve(join(appRoot, path === '/' ? 'index.html' : path));
  if (target !== appRoot && !target.startsWith(`${appRoot}/`)) {
    res.writeHead(403).end('forbidden');
    return;
  }
  try {
    const body = await readFile(target);
    res.writeHead(200, {
      'content-type': TYPES.get(extname(target).toLowerCase()) ?? 'application/octet-stream',
      'content-length': body.length,
      'cache-control': 'no-store',
    });
    res.end(body);
  } catch {
    res.writeHead(404).end('not found');
  }
});

const port = pickPort();
server.listen(port, '127.0.0.1', () => {
  console.log(`Leonida Trophy Atlas is on http://localhost:${port}`);
});
