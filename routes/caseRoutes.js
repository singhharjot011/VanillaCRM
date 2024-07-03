import express from "express";
import {
  createCase,
  getAllCases,
  getCase,
  getDataForLastDays,
} from "../src/controller/caseController.js";

const caseRouter = express.Router();

caseRouter.route("/").get(getAllCases).post(createCase);

caseRouter.route("/:id").get(getCase);

caseRouter.route("/data/:days").get(getDataForLastDays);

export default caseRouter;
