const { createApp } = require("./app");
const { validateEnv, env } = require("./config/env");

validateEnv();

const PORT = env.port;
const app = createApp();

app.listen(PORT, "0.0.0.0", () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on port ${PORT}`);
});

