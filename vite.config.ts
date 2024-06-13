import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    AutoImport({ 
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
      ],
      // global imports to register
      imports: [
        {
          "react-uuid": [["default", "uuid"]],
          "react": ['useState', 'useEffect', 'React', 'ReactNode'],
        },
      ],
      dirs: [
        './src/**',
      ],
      // Enable auto import by filename for default module exports under directories
      defaultExportByFilename: true,
      dts: true
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
