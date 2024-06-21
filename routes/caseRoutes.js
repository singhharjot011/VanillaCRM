import express from "express";
import { createCase, getAllCases } from "../src/controller/caseController.js";

const caseRouter = express.Router();

caseRouter.route("/").get(getAllCases).post(createCase);

export default caseRouter;
