import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import { buildCorsOptions } from "./config";

export interface AppOptions {
  allowedOrigins?: string[];
  isProduction?: boolean;
}

/**
 * Builds the Express app without binding a port, so tests can drive it
 * directly and the entry point stays responsible for process lifecycle.
 */
export function createApp({
  allowedOrigins = [],
  isProduction = process.env.NODE_ENV === "production",
}: AppOptions = {}) {
  const app = express();

  app.disable("x-powered-by");
  app.use(cors(buildCorsOptions(allowedOrigins, isProduction)));
  app.use(express.json({ limit: "100kb" }));

  app.get("/", (_req, res) => {
    res.json({ message: "Giganchor API - Ready to build something new." });
  });

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  // Express 5 forwards rejected async handlers here too, so one handler keeps
  // error responses JSON instead of falling back to the default HTML page.
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const status =
      typeof err === "object" &&
      err !== null &&
      "status" in err &&
      typeof (err as { status?: unknown }).status === "number"
        ? (err as { status: number }).status
        : 500;

    if (status >= 500) {
      console.error("Unhandled request error:", err);
      res.status(status).json({ error: "Internal server error" });
      return;
    }

    res.status(status).json({ error: "Invalid request body" });
  });

  return app;
}
