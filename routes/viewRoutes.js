import express from "express";
import {
  redirectBasedOnAuth,
  isLoggedIn,
  protect,
} from "../controller/authController.js";
import {
  aliasLast30Days,
  aliasLast7Days,
  aliasLast90Days,
} from "../controller/dashboardController.js";
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
  getSignupForm,
  getAddTask,
  getTaskView,
  getForgotPasswordForm,
  getSetNewPasswordForm,
  getCompleteSignupForm,
} from "../controller/viewsController.js";

const viewRouter = express.Router();

viewRouter.get("/login", getLoginForm);
viewRouter.get("/signup", getSignupForm);
viewRouter.get("/forgotPassword", getForgotPasswordForm);
viewRouter.get("/resetPassword/:token", getSetNewPasswordForm);
viewRouter.get("/completeSignup", getCompleteSignupForm);
viewRouter.use(isLoggedIn);


// Protected routes
viewRouter.get("/", protect, redirectBasedOnAuth);
viewRouter.get("/dashboard", protect, getDashboard);
viewRouter
  .route("/dashboard/last7Days")
  .get(protect, aliasLast7Days, getDashboard);
viewRouter
  .route("/dashboard/last30Days")
  .get(protect, aliasLast30Days, getDashboard);
viewRouter
  .route("/dashboard/last90Days")
  .get(protect, aliasLast90Days, getDashboard);
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
viewRouter.get("/add-task", protect, getAddTask);
viewRouter.get("/task/:taskId", protect, getTaskView);

viewRouter.get("/knowledge-base", protect, getKnowledgeBase);
viewRouter.post("/submit-user-data", protect, updateUserData);

export default viewRouter;
