import Event from "../model/EventModel.js";
import { getAll } from "./handlerFactory.js";

const getAllEvents = getAll(Event);
const createEvent = async (req, res) => {
  try {
    const assignedToData = await User.findOne({
      name: req.body.assignedToName,
    });

    const requestedByData = await User.findOne({
      name: req.body.requestedByName,
    });

    const clientData = await Client.findOne({ name: req.body.clientName });

    const newEvent = await Task.create({
      assignedTo: assignedToData._id,
      requestedBy: requestedByData._id,
      title: req.body.title,
      client: clientData._id,
      due: req.body.due,
      createdAt: req.body.createdAt,
      completed: req.body.completed,
      deleted: req.body.deleted,
      hidden: req.body.hidden,
      isAppointment: req.body.isAppointment,
      appointmentDate: req.body.appointmentDate,
      appointmentStartTime: req.body.appointmentStartTime,
      appointmentEndTime: req.body.appointmentEndTime,
      appointmentAgenda: req.body.appointmentAgenda,
    });

    res.status(201).json({
      status: "success",
      data: { task: newEvent },
    });
  } catch (err) {
    return {
      status: "fail",
      message: err.message,
    };
  }
};

const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    res.status(200).json({ status: "success", data: { event } });
  } catch (err) {
    return {
      status: "fail",
      message: err.message,
    };
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ status: "success", data: { event } });
  } catch (err) {
    return {
      status: "fail",
      message: err.message,
    };
  }
};

const deleteEvent = async (req, res) => {
  try {
    return null;
  } catch (err) {
    return {
      status: "fail",
      message: err.message,
    };
  }
};

export { getAllEvents, createEvent, getEvent, updateEvent, deleteEvent };
