import express from "express";
import cors from "cors";
import path from "path";
import { handleDemo } from "./routes/demo";

export function createServer() {
  const apiRouter = express.Router();

  // API middleware
  apiRouter.use(cors());
  apiRouter.use(express.json());
  apiRouter.use(express.urlencoded({ extended: true }));

  // Example API routes
  apiRouter.get("/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  apiRouter.get("/demo", handleDemo);

  // Create main app
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Mount API routes
  app.use("/api", apiRouter);

  // In production, serve static files and fallback to index.html for SPA routing
  if (process.env.NODE_ENV === "production") {
    app.use(
      express.static(path.join(__dirname, "../dist/spa"), { maxAge: "1h" }),
    );

    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "../dist/spa/index.html"));
    });
  }

  return app;
}
