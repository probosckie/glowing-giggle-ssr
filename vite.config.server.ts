import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    ssr: "src/entry-server.jsx",
    outDir: "dist/server",
    rollupOptions: {
      input: "src/entry-server.jsx",
      external: [
        "react",
        "react-dom",
        "react-dom/server",
        "react-router",
        "react-router-dom",
      ],
    },
  },
});
