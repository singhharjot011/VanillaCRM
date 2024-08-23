import express from "express";
import { protect } from "../src/controller/authController.js";
import {
  createCase,
  getAllCases,
  getCase,
  getDataForLastDays,
  updateCase,
} from "../src/controller/caseController.js";

const caseRouter = express.Router();
caseRouter.use(protect);  // Apply protect middleware
caseRouter.route("/").get(getAllCases).post(createCase);


caseRouter.route("/:id").get(getCase).patch(updateCase);

caseRouter.route("/data/:days").get(getDataForLastDays);

export default caseRouter;
