import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // set base to '/snid-qr-reader/' if deploying to https://<user>.github.io/sn id-qr-reader/
  base: '/'
})
