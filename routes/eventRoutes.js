import express from "express";
import {
  getAllEvents,
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
} from "../controller/eventController.js";

const eventRouter = express.Router();

eventRouter.route("/").get(getAllEvents).post(createEvent);

eventRouter.route("/:id").get(getEvent).patch(updateEvent).delete(deleteEvent);

export default eventRouter;
