import Client from "../model/clientModel.js";
import Task from "../model/taskModel.js";
import User from "../model/userModel.js";
import catchAsync from "../src/utils/catchAsync.js";
import { getAll, getOne } from "./handlerFactory.js";

const getAllTasks = getAll(Task);
const createTask = async (req, res) => {
  try {
    const assignedToData = await User.findOne({
      name: req.body.assignedToName,
    });

    const requestedByData = await User.findOne({
      name: req.body.requestedByName,
    });

    const clientData = await Client.findOne({ name: req.body.clientName });

    const newTask = await Task.create({
      assignedTo: assignedToData._id,
      requestedBy: requestedByData._id,
      description: req.body.description,
      client: clientData._id,
      due: req.body.due,
      taskCompletionNotes: req.body.taskCompletionNotes,
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
      data: { task: newTask },
    });
  } catch (err) {
    return {
      status: "fail",
      message: err.message,
    };
  }
};

const getTask = getOne(Task);
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ status: "success", data: { task } });
  } catch (err) {
    return {
      status: "fail",
      message: err.message,
    };
  }
};

const deleteTask = async (req, res) => {
  try {
    return null;
  } catch (err) {
    return {
      status: "fail",
      message: err.message,
    };
  }
};

export { getAllTasks, createTask, getTask, updateTask, deleteTask };
