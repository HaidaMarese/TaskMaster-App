import express from "express";
import Task from "../models/Task.js";
import Project from "../models/Project.js";
import { authMiddleware } from "../utils/auth.js";

const router = express.Router();
router.use(authMiddleware);

const verifyOwnership = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  return project && project.user.toString() === userId.toString();
};

// Get all tasks for user
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.json(tasks);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Create task
router.post("/projects/:projectId/tasks", async (req, res) => {
  try {
    const { projectId } = req.params;
    const isOwner = await verifyOwnership(projectId, req.user._id);
    if (!isOwner) return res.status(403).json({ message: "Unauthorized" });

    const task = await Task.create({
      ...req.body,
      project: projectId,
      user: req.user._id,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get tasks by project
router.get("/projects/:projectId/tasks", async (req, res) => {
  try {
    const { projectId } = req.params;
    const isOwner = await verifyOwnership(projectId, req.user._id);
    if (!isOwner) return res.status(403).json({ message: "Unauthorized" });

    const tasks = await Task.find({ project: projectId });
    res.json(tasks);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update task
router.put("/tasks/:taskId", async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const isOwner = await verifyOwnership(task.project, req.user._id);
    if (!isOwner) return res.status(403).json({ message: "Unauthorized" });

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.taskId,
      req.body,
      { new: true }
    );

    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete task
router.delete("/tasks/:taskId", async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const isOwner = await verifyOwnership(task.project, req.user._id);
    if (!isOwner) return res.status(403).json({ message: "Unauthorized" });

    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
