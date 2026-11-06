import { createApp } from "./app";
import { parseAllowedOrigins, parsePort } from "./config";

const isProduction = process.env.NODE_ENV === "production";
const allowedOrigins = parseAllowedOrigins();

if (isProduction && allowedOrigins.length === 0) {
  console.warn(
    "CORS_ORIGINS is not set: no browser origin will be granted cross-origin access. " +
      "Set it to a comma-separated list of site origins."
  );
}

const port = parsePort();
const server = createApp({ allowedOrigins, isProduction }).listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

const shutdown = (signal: NodeJS.Signals) => {
  console.log(`${signal} received, closing the HTTP server.`);
  server.close((error) => {
    if (error) {
      console.error("Failed to close the HTTP server cleanly:", error);
      process.exitCode = 1;
    }
    process.exit();
  });

  // Never hang a deploy on a stuck connection.
  setTimeout(() => {
    console.error("Shutdown timed out, exiting.");
    process.exit(1);
  }, 10_000).unref();
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
