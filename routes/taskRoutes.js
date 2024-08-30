import express from "express";
import { protect } from "../controller/authController.js";
import {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
} from "../controller/taskController.js";

const taskRouter = express.Router();

taskRouter.route("/").get(getAllTasks).post(protect, createTask);

taskRouter
  .route("/:id") 
  .get(getTask)
  .patch(protect, updateTask)
  .delete(deleteTask);

export default taskRouter;
