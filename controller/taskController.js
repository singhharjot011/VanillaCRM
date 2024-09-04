import Client from "../model/clientModel.js";
import Task from "../model/taskModel.js";
import User from "../model/userModel.js";
import catchAsync from "../src/utils/catchAsync.js";
import { getAll, getOne } from "./handlerFactory.js";

const getAllTasks = getAll(Task);

const createTask = catchAsync(async (req, res) => {
  const assignedToData = await User.findOne({
    name: req.body.assignedToName,
  });

  const requestedByData = await User.findOne({
    name: req.body.requestedByName,
  });

  const taskData = {
    assignedTo: assignedToData._id,
    requestedBy: requestedByData._id,
    description: req.body.description,
    isAppointment: req.body.isAppointment,
    createdBy: req.user._id,
    createdAt: req.body.createdAt,
  };

  if (req.body.isAppointment) {
    const clientData = await Client.findOne({ name: req.body.clientName });
    if (!clientData) {
      return res.status(400).json({
        status: "fail",
        message: "Client not found",
      });
    }
    taskData.client = clientData._id;
    taskData.clientName = clientData.name;
    taskData.appointmentDate = req.body.appointmentDate;
    taskData.appointmentStartTime = req.body.appointmentStartTime;
    taskData.appointmentEndTime = req.body.appointmentEndTime;
    taskData.appointmentAgenda = req.body.appointmentAgenda;
  } else {
    const today = new Date().toLocaleDateString("en-CA");
    taskData.due = req.body.due || today;
  }

  const newTask = await Task.create(taskData);

  res.status(201).json({
    status: "success",
    data: { task: newTask },
  });
});

const getTask = getOne(Task);

const updateTask = catchAsync(async (req, res) => {
  try {
    // Check if taskCompletionNotes is present in the request body
    if (req.body.taskCompletionNotes) {
      // If taskCompletionNotes is present, add these additional fields
      req.body.completedBy = req.user._id;
      req.body.completedAt = Date.now();
      req.body.completed = true;
    }

    // Find the task by ID and update it with the new data
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // If task is not found, send an error response
    if (!task) {
      return res.status(404).json({
        status: "fail",
        message: "Task not found",
      });
    }

    // Send a successful response with the updated task
    res.status(200).json({
      status: "success",
      data: { task },
    });
  } catch (err) {
    // Handle any errors that occur during the update process
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
});

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
