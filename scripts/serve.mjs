// serve.mjs — dev server statis sederhana (tanpa dependency).
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname, normalize } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const port = process.env.PORT || 4173;
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
    '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png',
    '.svg': 'image/svg+xml', '.webp': 'image/webp' };

createServer((req, res) => {
    let p = decodeURIComponent((req.url || '/').split('?')[0]);
    if (p === '/') p = '/index.html';
    const fp = normalize(join(root, p));
    if (!fp.startsWith(root) || !existsSync(fp) || !statSync(fp).isFile()) {
        res.writeHead(404); res.end('404'); return;
    }
    res.writeHead(200, { 'Content-Type': MIME[extname(fp)] || 'application/octet-stream' });
    res.end(readFileSync(fp));
}).listen(port, () => console.log('Hajir Chess dev server: http://localhost:' + port));
