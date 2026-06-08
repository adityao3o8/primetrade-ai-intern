const { z } = require("zod");

const taskStatusEnum = z.enum(["todo", "in_progress", "done"]);

const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(5000, "Description must be at most 5000 characters"),
  status: taskStatusEnum.optional().default("todo"),
});

const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().min(1).max(5000).optional(),
    status: taskStatusEnum.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

const taskIdSchema = z.object({
  id: z.string().uuid("Invalid task id"),
});

module.exports = { createTaskSchema, updateTaskSchema, taskIdSchema };
