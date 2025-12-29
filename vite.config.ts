import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  appType: "spa", // Enable SPA fallback for dev server
  server: {
    host: "::",
    port: 8080,
    middlewareMode: false,
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      const app = createServer();

      // Return pre middleware to handle API routes before Vite's fallback
      return {
        pre: [
          {
            handler: app,
            path: /^\/api\//,
          } as any,
        ],
      };
    },
  };
}
