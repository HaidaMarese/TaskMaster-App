import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./config/connection.js";

import usersRouter from "./routes/users.js";
import projectsRouter from "./routes/projects.js";
import tasksRouter from "./routes/tasks.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


const whitelist = [
  "http://localhost:5173",
  "https://tasmaster-haida-app.netlify.app", 
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};


app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use("/api/users", usersRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/tasks", tasksRouter);


app.get("/", (req, res) => {
  res.send("TaskMaster API is running...");
});


db.once("open", () => {
  app.listen(PORT, () =>
    console.log(`🌍 Server listening at http://localhost:${PORT}`)
  );
});
