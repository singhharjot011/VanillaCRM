import express from "express";
import {
  redirectBasedOnAuth,
  isLoggedIn,
  protect,
} from "../controller/authController.js";
import {
  getCalendar,
  getCasesView,
  getCaseView,
  getClient,
  getClientsView,
  getDashboard,
  getKnowledgeBase,
  getLoginForm,
  getMe,
  getMyClientsView,
  getTasks,
  updateUserData,
  getAddClient,
  getAddCase,
} from "../controller/viewsController.js";

const viewRouter = express.Router();

viewRouter.get("/login", getLoginForm);
viewRouter.use(isLoggedIn);
// viewRouter.use(auth);
// viewRouter.use(protect);

// Protected routes
viewRouter.get("/", redirectBasedOnAuth);
viewRouter.get("/dashboard", protect, getDashboard);
viewRouter.get("/me", protect, getMe);

viewRouter.get("/clients", protect, getClientsView);
viewRouter.get("/add-client", protect, getAddClient);
viewRouter.get("/my-clients", protect, getMyClientsView);
viewRouter.get("/client/:slug", protect, getClient);

viewRouter.get("/cases", protect, getCasesView);
viewRouter.get("/case/:caseId", protect, getCaseView);
viewRouter.get("/add-case", protect, getAddCase);

viewRouter.get("/calendar", protect, getCalendar);
viewRouter.get("/tasks", protect, getTasks);
viewRouter.get("/knowledge-base", protect, getKnowledgeBase);
viewRouter.post("/submit-user-data", protect, updateUserData);


export default viewRouter;
