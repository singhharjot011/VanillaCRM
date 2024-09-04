import express from "express";
import { protect, restrictTo } from "../controller/authController.js";
import {
  createClient,
  deleteClient,
  getAllClients,
  getClient,
  getClientByName,
  updateClient,
} from "../controller/clientController.js";

const clientRouter = express.Router();

clientRouter
  .route("/")
  .get(getClientByName, getAllClients)
  .post(protect, createClient);
// clientRouter.route("/").get(getAllClients).post(restrictTo('associate','manager'),createClient);

clientRouter
  .route("/:id")
  .get(getClient)
  .patch(protect, updateClient)
  .delete(restrictTo("associate", "manager"), deleteClient);


export default clientRouter;
