import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],resolve: {
    // Force standard resolution parameters to a single copy of React
    dedupe: ['react', 'react-dom'],
  },
});