import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist/client',
    target: 'esnext',
    sourcemap: true,
    lib: {
      entry: './src/main.ts',
      formats: ['es'],
      fileName: format => `bundle.${format}.js`
    },
    rollupOptions: {
      external: [],
    },
  }
})
