import express from "express";
import {
  createClient,
  getAllClients,
  getClient,
} from "../src/controller/clientController.js";

const clientRouter = express.Router();

clientRouter.route("/").get(getAllClients).post(createClient);

clientRouter.route("/:id").get(getClient);

export default clientRouter;
