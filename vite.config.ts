import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  build: {
    // three.js dwarfs everything else, so it gets its own chunk and is only
    // fetched once the page is already interactive (see the lazy imports in
    // pages/home.jsx and components/hero.jsx)
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three", "@react-three/fiber"],
          motion: ["framer-motion", "gsap"],
          react: ["react", "react-dom", "wouter"],
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },
});
