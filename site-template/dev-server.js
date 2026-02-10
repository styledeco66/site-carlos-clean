const http = require('http');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const port = 8080;

const mime = {
  '.html':'text/html; charset=utf-8',
  '.css':'text/css; charset=utf-8',
  '.js':'application/javascript; charset=utf-8',
  '.json':'application/json; charset=utf-8',
  '.svg':'image/svg+xml',
  '.png':'image/png',
  '.jpg':'image/jpeg',
  '.jpeg':'image/jpeg',
  '.webp':'image/webp',
  '.ico':'image/x-icon',
  '.txt':'text/plain; charset=utf-8',
  '.xml':'application/xml; charset=utf-8'
};

function send(res, code, body, type='text/plain; charset=utf-8') {
  res.writeHead(code, { 'Content-Type': type });
  res.end(body);
}

http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  let filePath = path.join(root, urlPath === '/' ? '/index.html' : urlPath);

  if (!filePath.startsWith(root)) return send(res, 403, 'Forbidden');

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isDirectory()) filePath = path.join(filePath, 'index.html');

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) return send(res, 404, 'Not found');
      const ext = path.extname(filePath).toLowerCase();
      send(res, 200, data, mime[ext] || 'application/octet-stream');
    });
  });
}).listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
