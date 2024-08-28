import express from "express";
import { protect } from "../controller/authController.js";
import {
  createCase,
  getAllCases,
  getCase,
  getDataForLastDays,
  updateCase,
  getCaseByCaseId,
} from "../controller/caseController.js";
import { getMe } from "../controller/userController.js";

const caseRouter = express.Router();
caseRouter.use(protect); // Apply protect middleware
caseRouter
  .route("/")
  .get(getCaseByCaseId, getAllCases)
  .post(protect, getMe, createCase);

caseRouter.route("/:id").get(getCase).patch(protect, getMe, updateCase);

caseRouter.route("/data/:days").get(getDataForLastDays);

export default caseRouter;
