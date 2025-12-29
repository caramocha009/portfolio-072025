import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
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

      // Add Express app as middleware to Vite dev server
      server.middlewares.use(app);

      // Return middleware for SPA fallback (only for non-API routes)
      return () => {
        server.middlewares.use((req, res, next) => {
          // Don't interfere with Vite's asset serving or API routes
          if (req.url.startsWith("/api") || req.url.includes(".")) {
            return next();
          }
          // For SPA routes, serve index.html
          req.url = "/index.html";
          next();
        });
      };
    },
  };
}
