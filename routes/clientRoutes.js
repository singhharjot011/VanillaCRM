import express from "express";
import { protect, restrictTo } from "../controller/authController.js";
import {
  createClient,
  deleteClient,
  getAllClients,
  getClient,
  getClientByName,
  getDataForLastDays,
  updateClient,
} from "../controller/clientController.js";
import { getMe } from "../controller/userController.js";

const clientRouter = express.Router();

clientRouter
  .route("/")
  .get(getClientByName, getAllClients)
  .post(protect, getMe, createClient);
// clientRouter.route("/").get(getAllClients).post(restrictTo('associate','manager'),createClient);

clientRouter
  .route("/:id")
  .get(getClient)
  .patch(protect, getMe, updateClient)
  .delete(restrictTo("associate", "manager"), deleteClient);

// clientRouter.route("/tour-stats").get();

clientRouter.route("/data/:days").get(getDataForLastDays);

export default clientRouter;
