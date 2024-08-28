import Case from "../model/caseModel.js";
import Client from "../model/clientModel.js";
import { handleClientObject } from "../model/model.js";
import Task from "../model/taskModel.js";
import User from "../model/userModel.js";
import APIFeatures from "../src/utils/apiFeatures.js";
import AppError from "../src/utils/appError.js";
import catchAsync from "../src/utils/catchAsync.js";
import { getDateTimeString, getColor } from "../src/utils/helpers.js";
import { getAll } from "./handlerFactory.js";

export const getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render("login", {
    title: "Login",
  });
});

export const getSignupForm = catchAsync(async (req, res, next) => {
  res.status(200).render("signup", {
    title: "Signup",
  });
});

export const getClientsView = catchAsync(async (req, res) => {
  const features = new APIFeatures(
    Client.find().populate(["consultant", "cases"]),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const clients = await features.query;

  // Ensure totalClients is a valid number
  const totalClients = await Client.countDocuments();
  const limit = parseInt(req.query.limit) || 10; // Default to 10 if not provided
  const totalPages = Math.ceil(totalClients / limit);

  let sortParams = "";

  switch (req.query.sort) {
    case "name":
      sortParams = "Name - (A-Z)";
      break;

    case "-name":
      sortParams = "Name - (Z-A)";
      break;

    case "createdAt":
      sortParams = "Oldest";
      break;
    case "-createdAt":
      sortParams = "Latest";
      break;

    case "visaType":
      sortParams = "Visa Type - (A-Z)";
      break;

    default:
      sortParams = "";
      break;
  }

  res.status(200).render("clients", {
    title: "All Clients",
    clients,
    sortParams,
    totalPages,
    getDateTimeString,
    currentPage: parseInt(req.query.page) || 1,
  });
});

export const getMyClientsView = catchAsync(async (req, res) => {
  const features = new APIFeatures(
    Client.find({ consultant: req.user._id }).populate(["consultant", "cases"]),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const clients = await features.query;

  // Ensure totalClients is a valid number
  const totalClients = await Client.countDocuments();
  const limit = parseInt(req.query.limit) || 10; // Default to 10 if not provided
  const totalPages = Math.ceil(totalClients / limit);

  let sortParams = "";

  switch (req.query.sort) {
    case "name":
      sortParams = "Name - (A-Z)";
      break;

    case "-name":
      sortParams = "Name - (Z-A)";
      break;

    case "createdAt":
      sortParams = "Oldest";
      break;
    case "-createdAt":
      sortParams = "Latest";
      break;

    case "visaType":
      sortParams = "Visa Type - (A-Z)";
      break;

    default:
      sortParams = "";
      break;
  }

  // 2) Render the template using the client data
  res.status(200).render("myClients", {
    title: "My Clients",
    clients,
    sortParams,
    totalPages,
    getDateTimeString,
    currentPage: parseInt(req.query.page) || 1,
  });
});

export const getUserId = catchAsync(async (req, res) => {
  const userId = req.user._id;

  res.status(200).json({
    status: "success",
    data: { userId },
  });
});

export const getAddClient = catchAsync(async (req, res) => {
  // 1) Take form data and create a new client
  // await handleClientObject(req.body);

  const consultants = await User.find();
  const clientsNames = await Client.find().select("name");

  // 2) Render the template using the client data
  res.status(200).render("client", {
    title: "New Client",
    consultants,
    clientsNames,
    getDateTimeString,
  });
});

export const getAddCase = catchAsync(async (req, res) => {
  // 1) Take form data and create a new client

  const consultants = await User.find();
  const clients = await Client.find();

  // 2) Render the template using the client data
  res.status(200).render("case", {
    title: "New Case",
    consultants,
    getDateTimeString,
    clients,
  });
});

export const getAddTask = catchAsync(async (req, res) => {
  // 1) Take form data and create a new client

  const consultants = await User.find();
  const clients = await Client.find();

  // 2) Render the template using the client data
  res.status(200).render("task", {
    title: "New Task",
    consultants,
    getDateTimeString,
    clients,
  });
});

export const getClient = catchAsync(async (req, res) => {
  // 1) Get client data from the collection and populate the consultant and cases fields
  const client = await Client.findOne({ slug: req.params.slug })
    .populate("consultant")
    .populate({ path: "lastUpdatedBy", select: "name" });
  const consultants = await User.find();
  if (!client) {
    return next(new AppError("There is no Client of that name"));
  }

  const clientsNames = await Client.find().select("name");

  // 2) Render the template using the client data
  res.status(200).render("client", {
    title: "Client",
    client,
    clientsNames,
    consultants,
    getDateTimeString,
  });
});

export const getCasesView = catchAsync(async (req, res) => {
  const features = new APIFeatures(
    Case.find().populate(["assignedTo", "client"]),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // Get the cases based on the query
  const cases = await features.query;

  // Ensure totalCases is a valid number
  const totalCases = await Case.countDocuments();
  const limit = parseInt(req.query.limit) || 10;
  const totalPages = Math.ceil(totalCases / limit);

  // Determine the sort parameters for display purposes
  let sortParams = "";
  switch (req.query.sort) {
    case "createdAt":
      sortParams = "Oldest";
      break;
    case "-createdAt":
      sortParams = "Newest";
      break;
    case "caseStatus":
      sortParams = "Status";
      break;
    default:
      sortParams = "";
      break;
  }

  // Render the view with the cases and additional data
  res.status(200).render("cases", {
    title: "All Cases",
    cases,
    sortParams,
    totalPages,
    getColor,
    getDateTimeString,
    currentPage: parseInt(req.query.page) || 1,
  });
});

export const getCaseView = catchAsync(async (req, res) => {
  // 1) Get case data from the collection and populate the consultant and cases fields
  const c = await Case.findOne({ caseId: req.params.caseId })
    .populate("assignedTo")
    .populate("client")
    .populate({
      path: "notes.writtenBy",
      select: "name",
    });
  const consultants = await User.find();

  // 2) Render the template using the case data
  res.status(200).render("case", {
    title: "Case",
    c,
    consultants,
    getDateTimeString,
  });
});
export const getTaskView = catchAsync(async (req, res) => {
  // 1) Get task data from the collection and populate the consultant and tasks fields
  const task = await Task.findOne({ taskId: req.params.taskId });
  const consultants = await User.find();
  const clients = await Client.find();

  // 2) Render the template using the case data
  res.status(200).render("case", {
    title: "Case",
    task,
    consultants,
    clients,
    getDateTimeString,
  });
});

export const getDashboard = catchAsync(async (req, res) => {
  res.status(200).render("dashboard", {
    title: "Dashboard",
  });
});

export const getCalendar = catchAsync(async (req, res) => {
  const features = new APIFeatures(
    Task.find({ consultant: req.user._id }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tasks = await features.query;

  res.status(200).render("calendar", {
    tasks,
    getDateTimeString,
    title: "Calendar",
  });
});

export const getTasks = catchAsync(async (req, res) => {
  const features = new APIFeatures(Task.find().populate("client"), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // Get the cases based on the query
  const tasks = await features.query;

  // Ensure totalTasks is a valid number
  const totalTasks = await Task.countDocuments();
  const limit = parseInt(req.query.limit) || 10;
  const totalPages = Math.ceil(totalTasks / limit);

  // Determine the sort parameters for display purposes
  let sortParams = "";
  // switch (req.query.sort) {
  //   case "createdAt":
  //     sortParams = "Oldest";
  //     break;
  //   case "-createdAt":
  //     sortParams = "Newest";
  //     break;
  //   case "caseStatus":
  //     sortParams = "Status";
  //     break;
  //   default:
  //     sortParams = "";
  //     break;
  // }

  // Render the view with the cases and additional data
  res.status(200).render("tasks", {
    title: "All Tasks",
    tasks,
    sortParams,
    totalPages,
    getColor,
    getDateTimeString,
    currentPage: parseInt(req.query.page) || 1,
  });
});

export const getKnowledgeBase = catchAsync((req, res) => {
  res.status(200).render("knowledgeBase", {
    title: "Knowledge Base",
  });
});

export const getMe = catchAsync(async (req, res) => {
  res.status(200).render("account", {
    title: "My Account",
  });
});

export const updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).render("account", {
    title: "My Account",
    user: updatedUser,
  });
});
