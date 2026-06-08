const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");

const { env } = require("./config/env");
const swaggerJson = require("./docs/swagger");

const authRoutes = require("./routes/auth.routes");
const tasksRoutes = require("./routes/tasks.routes");
const { errorHandler } = require("./middleware/errorHandler");

function createApp() {
  const app = express();

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(express.json({ limit: "10kb" }));
  app.use(morgan("dev"));
  app.use(cookieParser());

  // Whitelist CORS origins and allow credentials for HttpOnly cookies.
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow non-browser clients with no Origin header (Postman, curl).
        if (!origin) return callback(null, true);
        if (env.corsOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("Not allowed by CORS"), false);
      },
      credentials: true,
    })
  );

  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerJson));

  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/tasks", tasksRoutes);

  app.get("/health", (req, res) => {
    res.json({ ok: true });
  });

  app.use((req, res) => {
    res.status(404).json({ message: "Not found" });
  });

  app.use(errorHandler);

  return app;
}

module.exports = { createApp };

