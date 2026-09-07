import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        ws: true,
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            // Gracefully handle proxy error when local backend is not actively running
            if (res && !res.headersSent && typeof res.writeHead === 'function') {
              try {
                res.writeHead(503, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Backend server offline on local dev' }));
              } catch (e) {}
            }
          });
        },
      },
    },
  },
})