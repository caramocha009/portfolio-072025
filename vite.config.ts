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

      // Add Express as middleware first (for API routes)
      server.middlewares.use(app);

      // Add SPA fallback for routes not handled by Express or Vite assets
      return () => {
        server.middlewares.use((_req, _res, next) => {
          // This middleware runs after all other middlewares
          // If we get here and the response hasn't been sent,
          // the request should be handled by Vite's default behavior
          next();
        });
      };
    },
  };
}
