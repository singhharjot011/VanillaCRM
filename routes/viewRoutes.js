import express from "express";
import { isLoggedIn, protect } from "../src/controller/authController.js";
import {
  getCalendar,
  getCasesView,
  getCaseView,
  getClient,
  getClientsView,
  getDashboard,
  getKnowledgeBase,
  getLoginForm,
  getMyClientsView,
  getTasks,
} from "../src/controller/viewsController.js";

const viewRouter = express.Router();

viewRouter.use(isLoggedIn);

viewRouter.get("/", getDashboard);
viewRouter.get("/dashboard", getDashboard);

viewRouter.get("/login", getLoginForm);

viewRouter.get("/clients", getClientsView);
viewRouter.get("/my-clients", getMyClientsView);
viewRouter.get("/client/:slug", getClient);
viewRouter.get("/cases", getCasesView);
viewRouter.get("/case/:caseId", getCaseView);
viewRouter.get("/calendar", getCalendar);
viewRouter.get("/tasks", getTasks);
viewRouter.get("/knowledge-base", getKnowledgeBase);

export default viewRouter;
