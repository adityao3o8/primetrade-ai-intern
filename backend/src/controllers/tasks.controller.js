const tasksService = require("../services/tasks.service");

async function listTasks(req, res, next) {
  try {
    const tasks = await tasksService.listTasks(req.auth);
    return res.status(200).json({ tasks });
  } catch (err) {
    return next(err);
  }
}

async function createTask(req, res, next) {
  try {
    const task = await tasksService.createTask(req.auth, req.body);
    return res.status(201).json({ task });
  } catch (err) {
    return next(err);
  }
}

async function getTaskById(req, res, next) {
  try {
    const task = await tasksService.getTaskById(req.auth, req.params.id);
    return res.status(200).json({ task });
  } catch (err) {
    return next(err);
  }
}

async function updateTask(req, res, next) {
  try {
    const task = await tasksService.updateTask(req.auth, req.params.id, req.body);
    return res.status(200).json({ task });
  } catch (err) {
    return next(err);
  }
}

async function deleteTask(req, res, next) {
  try {
    await tasksService.deleteTask(req.auth, req.params.id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

module.exports = { listTasks, createTask, getTaskById, updateTask, deleteTask };

