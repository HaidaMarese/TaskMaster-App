import express from "express";
import User from "../models/User.js";
import { signToken } from "../utils/auth.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = signToken(user);
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await user.isCorrectPassword(req.body.password))) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const token = signToken(user);
  res.json({ token, user });
});

export default router;
