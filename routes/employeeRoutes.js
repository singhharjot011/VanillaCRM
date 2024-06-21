import express from "express";
import getAllEmployees from "../src/controller/employeeController.js";

const employeeRouter = express.Router();

employeeRouter.route("/").get(getAllEmployees);

export default employeeRouter;
