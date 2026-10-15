import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Custom middleware to serve root images
const serveStaticPlugin = () => ({
  name: 'serve-static-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const decodedUrl = decodeURIComponent(req.url.split('?')[0]);
      const filePath = path.join(process.cwd(), decodedUrl);
      
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes = {
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.svg': 'image/svg+xml',
          '.gif': 'image/gif',
          '.webp': 'image/webp'
        };
        
        if (mimeTypes[ext]) {
          res.setHeader('Content-Type', mimeTypes[ext]);
          return fs.createReadStream(filePath).pipe(res);
        }
      }
      next();
    });
  }
});

export default defineConfig({
  plugins: [react(), serveStaticPlugin()],
  server: {
    port: 5173,
    host: true
  }
});
