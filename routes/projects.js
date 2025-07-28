import express from "express";
import Project from "../models/Project.js";
import User from "../models/User.js";
import Task from "../models/Task.js";
import { authMiddleware } from "../utils/auth.js";

const router = express.Router();

router.use(authMiddleware);


router.post("/", async (req, res) => {
  try {
    const project = await Project.create({ ...req.body, user: req.user._id });
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.get("/", async (req, res) => {
  const owned = await Project.find({ user: req.user._id });
  const shared = await Project.find({ "members.user": req.user._id });
  res.json([...owned, ...shared]);
});


router.get("/:id", async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (
    !project ||
    (!project.user.equals(req.user._id) &&
      !project.members.some((m) => m.user.equals(req.user._id)))
  ) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  res.json(project);
});


router.put("/:id", async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project || !project.user.equals(req.user._id)) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  Object.assign(project, req.body);
  await project.save();
  res.json(project);
});


router.delete("/:id", async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project || !project.user.equals(req.user._id)) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  await project.deleteOne();
  res.json({ message: "Project deleted" });
});


router.post("/:id/invite", async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project || !project.user.equals(req.user._id)) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const invited = await User.findOne({ email: req.body.email });
  if (!invited) return res.status(404).json({ message: "User not found" });

  project.members.push({ user: invited._id });
  await project.save();

  res.json({ message: "User invited", project });
});


router.get("/:projectId/tasks", async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);
    if (
      !project ||
      (!project.user.equals(req.user._id) &&
        !project.members.some((m) => m.user.equals(req.user._id)))
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const tasks = await Task.find({ project: projectId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/:projectId/tasks", async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);
    if (!project || project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

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

export default router;
