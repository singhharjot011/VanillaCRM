import express from "express";
import getAllEvents from "../src/controller/eventController.js";

const eventRouter = express.Router();

eventRouter.route("/").get(getAllEvents);

export default eventRouter;
