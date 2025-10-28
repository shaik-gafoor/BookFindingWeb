import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api/openlibrary": {
        target: "https://openlibrary.org",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/openlibrary/, ""),
        secure: true,
        headers: {
          "User-Agent": "BookFinder/1.0",
        },
      },
      "/api/covers": {
        target: "https://covers.openlibrary.org",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/covers/, ""),
        secure: true,
      },
    },
  },
});
