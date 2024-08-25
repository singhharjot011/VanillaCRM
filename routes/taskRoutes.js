import express from "express";
import {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
} from "../controller/taskController.js";

const taskRouter = express.Router();

taskRouter.route("/").get(getAllTasks).post(createTask);

taskRouter.route("/:id").get(getTask).patch(updateTask).delete(deleteTask);

export default taskRouter;
