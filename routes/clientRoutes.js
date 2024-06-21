import express from "express";
import {
  createClient,
  getAllClients,
} from "../src/controller/clientController.js";

const clientRouter = express.Router();

clientRouter.route("/").get(getAllClients).post(createClient);

export default clientRouter;
