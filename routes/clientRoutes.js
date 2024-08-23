import express from "express";
import { protect, restrictTo } from "../src/controller/authController.js";
import {
  createClient,
  deleteClient,
  getAllClients,
  getClient,
  getDataForLastDays,
  updateClient,
} from "../src/controller/clientController.js";

const clientRouter = express.Router();

clientRouter.route("/").get(protect, getAllClients).post(createClient);
// clientRouter.route("/").get(getAllClients).post(restrictTo('associate','manager'),createClient);

clientRouter
  .route("/:id")
  .get(getClient)
  .patch(updateClient)
  .delete(restrictTo("associate", "manager"), deleteClient);

clientRouter.route("/data/:days").get(getDataForLastDays);

export default clientRouter;
