import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/check_session': 'http://localhost:5000', // Adjust this URL to match your backend server's address and port
      // Add more proxy rules as needed
    },
  },
});
