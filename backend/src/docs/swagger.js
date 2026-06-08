const swaggerJson = {
  openapi: "3.0.3",
  info: {
    title: "Primetrade Tasks API",
    version: "1.0.0",
  },
  servers: [{ url: "/" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          message: { type: "string" },
          details: { type: "array", items: {} },
        },
      },
    },
  },
  paths: {
    "/api/v1/auth/register": {
      post: {
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 8 },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "User created" },
          "400": { description: "Validation error" },
          "409": { description: "Email already in use" },
        },
      },
    },
    "/api/v1/auth/me": {
      get: {
        tags: ["Auth"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Current user" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/api/v1/auth/login": {
      post: {
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Logged in" },
          "400": { description: "Validation error" },
          "401": { description: "Invalid credentials" },
        },
      },
    },
    "/api/v1/tasks": {
      get: {
        tags: ["Tasks"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "List tasks" },
          "401": { description: "Unauthorized" },
        },
      },
      post: {
        tags: ["Tasks"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "description"],
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  status: { type: "string", enum: ["todo", "in_progress", "done"] },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Task created" },
          "400": { description: "Validation error" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/api/v1/tasks/{id}": {
      get: {
        tags: ["Tasks"],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Task" },
          "401": { description: "Unauthorized" },
          "404": { description: "Task not found" },
        },
      },
      put: {
        tags: ["Tasks"],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  status: { type: "string", enum: ["todo", "in_progress", "done"] },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Task updated" },
          "400": { description: "Validation error" },
          "401": { description: "Unauthorized" },
          "404": { description: "Task not found" },
        },
      },
      delete: {
        tags: ["Tasks"],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "204": { description: "Task deleted" },
          "401": { description: "Unauthorized" },
          "404": { description: "Task not found" },
        },
      },
    },
  },
};

module.exports = swaggerJson;

