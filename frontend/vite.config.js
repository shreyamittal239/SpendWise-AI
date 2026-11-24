import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"
import { normalizeBackendUrl } from "./src/services/backendUrl.js"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === "production") {
    const env = loadEnv(mode, ".", "VITE_");
    normalizeBackendUrl(env.VITE_API_URL);
  }

  return {
    plugins: [react(),
      tailwindcss(),
    ],
  };
})
