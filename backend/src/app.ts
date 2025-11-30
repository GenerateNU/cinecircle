import express from "express";
import cors from "cors";
import { apiReference } from "@scalar/express-api-reference";
import routes from "./routes/index.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/", (_req, res) => {
    res.json({
      status: "success",
      message: "CineCircle backend is up & running!",
    });
  });

  // Scalar API Docs (OpenAPI 3.0)
  app.use(
    "/docs",
    apiReference({
      url: "/openapi.json",
      theme: "laserwave",
      pageTitle: "Absolute CineCircle",
    }),
  );

  // Register routes
  app.use(routes);

  

  // 404 Handler
  app.use((_req, res) => {
    res.status(404).json({
      status: "error",
      message: "You probably shouldn't be here",
    });
  });

  return app;
}
