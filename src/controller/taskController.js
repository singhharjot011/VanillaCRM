import Task from "../model/taskModel.js";

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({
      status: "success",
      results: tasks.length,
      data: { tasks },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

const createTask = async (req, res) => {
  try {
    const newTask = await Task.create(req.body);

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

const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    res.status(200).json({ status: "success", data: { task } });
  } catch (err) {
    return {
      status: "fail",
      message: err.message,
    };
  }
};

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
