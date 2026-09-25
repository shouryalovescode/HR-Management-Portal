import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Forwards API calls to your existing Express backend during development.
      // Adjust the target if your backend runs on a different port.
      "/auth": "http://localhost:5000",
      "/users": "http://localhost:5000"
    }
  }
});
