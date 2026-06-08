const prisma = require("../utils/prisma");
const AppError = require("../utils/AppError");

async function listTasks(auth) {
  if (auth.role === "admin") {
    return prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  return prisma.task.findMany({
    where: { userId: auth.userId },
    orderBy: { createdAt: "desc" },
  });
}

async function createTask(auth, { title, description, status }) {
  return prisma.task.create({
    data: {
      title,
      description,
      status,
      userId: auth.userId,
    },
  });
}

async function getTaskById(auth, id) {
  if (auth.role === "admin") {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) throw new AppError("Task not found", 404);
    return task;
  }

  const task = await prisma.task.findFirst({
    where: { id, userId: auth.userId },
  });
  if (!task) throw new AppError("Task not found", 404);
  return task;
}

async function updateTask(auth, id, { title, description, status }) {
  if (auth.role !== "admin") {
    const existing = await prisma.task.findFirst({
      where: { id, userId: auth.userId },
    });
    if (!existing) throw new AppError("Task not found", 404);

    return prisma.task.update({
      where: { id },
      data: { title, description, status },
    });
  }

  const existing = await prisma.task.findUnique({ where: { id } });
  if (!existing) throw new AppError("Task not found", 404);

  return prisma.task.update({
    where: { id },
    data: { title, description, status },
  });
}

async function deleteTask(auth, id) {
  if (auth.role !== "admin") {
    const existing = await prisma.task.findFirst({
      where: { id, userId: auth.userId },
    });
    if (!existing) throw new AppError("Task not found", 404);

    await prisma.task.delete({ where: { id } });
    return;
  }

  await prisma.task.delete({ where: { id } });
}

module.exports = { listTasks, createTask, getTaskById, updateTask, deleteTask };

