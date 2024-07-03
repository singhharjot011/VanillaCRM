import express from "express";
import {
  createClient,
  getAllClients,
  getClient,
  getDataForLastDays
} from "../src/controller/clientController.js";

const clientRouter = express.Router();

clientRouter.route("/").get(getAllClients).post(createClient);

clientRouter.route("/:id").get(getClient);

clientRouter.route("/data/:days").get(getDataForLastDays);

export default clientRouter;
