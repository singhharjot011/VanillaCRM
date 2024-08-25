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

const clientRouter = express.Router();

clientRouter.route("/").get(getClientByName, getAllClients).post(createClient);
// clientRouter.route("/").get(getAllClients).post(restrictTo('associate','manager'),createClient);

clientRouter
  .route("/:id")
  .get(getClient)
  .patch(updateClient)
  .delete(restrictTo("associate", "manager"), deleteClient);

clientRouter.route("/data/:days").get(getDataForLastDays);

export default clientRouter;
