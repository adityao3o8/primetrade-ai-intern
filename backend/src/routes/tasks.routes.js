const express = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const { validateBody, validateParams } = require("../middleware/validate");
const taskController = require("../controllers/tasks.controller");
const {
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema,
} = require("../validators/task.schema");

const router = express.Router();

// Protect all /api/v1/tasks routes
router.use(requireAuth);

router.get("/", taskController.listTasks);

router.post("/", validateBody(createTaskSchema), taskController.createTask);

router.get(
  "/:id",
  validateParams(taskIdSchema),
  taskController.getTaskById
);

router.put(
  "/:id",
  validateParams(taskIdSchema),
  validateBody(updateTaskSchema),
  taskController.updateTask
);

router.delete(
  "/:id",
  validateParams(taskIdSchema),
  taskController.deleteTask
);

module.exports = router;

