import express from "express";
import {
  createCase,
  getAllCases,
  getCase,
} from "../src/controller/caseController.js";

const caseRouter = express.Router();

caseRouter.route("/").get(getAllCases).post(createCase);

caseRouter.route("/:id").get(getCase);

export default caseRouter;
