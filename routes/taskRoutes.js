import express from "express";
import getAllTasks from "../src/controller/taskController.js";

const taskRouter = express.Router();

taskRouter.route("/").get(getAllTasks);

export default taskRouter;
