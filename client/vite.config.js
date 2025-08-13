import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    open: true,
    port: 3001
  },
  plugins: [react()],
  base: "/Sasa_s_weeks/",
})
