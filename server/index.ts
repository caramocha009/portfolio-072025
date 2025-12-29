import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { handleDemo } from "./routes/demo";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Serve static files and fallback to index.html for SPA routing
  if (process.env.NODE_ENV === "production") {
    app.use(
      express.static(path.join(__dirname, "../dist/spa"), { maxAge: "1h" }),
    );

    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "../dist/spa/index.html"));
    });
  } else {
    // In development, serve index.html for SPA routes (let Vite handle assets)
    app.get("*", (_req, res) => {
      const indexPath = path.join(__dirname, "../index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("index.html not found");
      }
    });
  }

  return app;
}
