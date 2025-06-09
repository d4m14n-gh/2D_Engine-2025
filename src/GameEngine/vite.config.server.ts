import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist/server',
    target: 'node18',
    lib: {
      entry: './src/Server/main.ts',
      formats: ['cjs', 'es'],
      fileName: format => `bundle.server.${format}.js`
    },
    rollupOptions: {
      external: [
        'fs', 'http', 'path', 'zlib', 'stream', 'crypto', 'url', 'querystring', 'timers', "socket.io", "uuid",
      ]
    },
    // minify: false,
    sourcemap: true,
  }
})
