import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    // Provide stub modules for Figma Make's virtual imports so Vite doesn't
    // error when processing __figma__entrypoint__.ts in the Make preview environment.
    {
      name: 'figma-virtual-modules',
      resolveId(id) {
        if (id === 'figma:foundry-client-api' || id.startsWith('figma:asset/')) {
          return '\0' + id
        }
      },
      load(id) {
        if (id === '\0figma:foundry-client-api' || id.startsWith('\0figma:asset/')) {
          return 'export default {}'
        }
      },
    },
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
