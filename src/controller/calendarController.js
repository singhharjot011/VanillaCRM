import Event from "../model/eventModel.js";
import { getAll } from "./handlerFactory.js";

const getAllEvents = getAll(Event);

export { getAllEvents };
