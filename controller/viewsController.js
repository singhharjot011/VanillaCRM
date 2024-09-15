import Case from "../model/caseModel.js";
import Client from "../model/clientModel.js";
import Task from "../model/taskModel.js";
import User from "../model/userModel.js";
import APIFeatures from "../src/utils/apiFeatures.js";
import AppError from "../src/utils/appError.js";
import catchAsync from "../src/utils/catchAsync.js";
import { getDateTimeString, getColor } from "../src/utils/helpers.js";

export const getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render("login", {
    title: "Login",
  });
});

export const getForgotPasswordForm = catchAsync(async (req, res, next) => {
  res.status(200).render("forgotPassword", {
    title: "Password Reset",
  });
});

export const getSetNewPasswordForm = catchAsync(async (req, res, next) => {
  res.status(200).render("setNewPassword", {
    title: "Set New password",
  });
});
export const getCompleteSignupForm = catchAsync(async (req, res, next) => {
  res.status(200).render("completeSignup", {
    title: "Complete Sign Up",
  });
});

export const getSignupForm = catchAsync(async (req, res, next) => {
  res.status(200).render("signup", {
    title: "Signup",
  });
});

export const getClientsView = catchAsync(async (req, res) => {
  if (Object.keys(req.query).length === 0) {
    req.query.limit = "10";
    req.query.sort = "-createdAt";
  }
  const features = new APIFeatures(
    Client.find().populate(["consultant", "cases", "tasks"]),
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
      sortParams = "Newest";
      break;

    case "visaType":
      sortParams = "Visa Type - (A-Z)";
      break;
    case "-lastUpdatedAt":
      sortParams = "Last Updated";
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
  if (Object.keys(req.query).length === 0) {
    req.query.limit = "10";
    req.query.sort = "-createdAt";
  }
  const features = new APIFeatures(
    Client.find().populate(["consultant", "cases", "tasks"]),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const clients = await features.query;

  // Ensure totalClients is a valid number
  const totalClients = await Client.countDocuments({
    consultant: req.user._id,
  });

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
      sortParams = "Newest";
      break;

    case "visaType":
      sortParams = "Visa Type - (A-Z)";
      break;

    case "-lastUpdatedAt":
      sortParams = "Last Updated";
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
  const user = await User.findOne({ _id: req.user._id });
  // 1) Take form data and create a new client

  const consultants = await User.find();
  const clients = await Client.find();

  // 2) Render the template using the client data
  res.status(200).render("task", {
    title: "New Task",
    consultants,
    user,
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
  if (Object.keys(req.query).length === 0) {
    req.query.limit = "10";
    req.query.sort = "-createdAt";
  }
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
    case "-lastUpdated":
      sortParams = "Last Updated";
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
  const task = await Task.findOne({ id: req.params.taskId });
  const consultants = await User.find();
  const clients = await Client.find();

  // 2) Render the template using the case data
  res.status(200).render("task", {
    title: "Task",
    task,
    consultants,
    clients,
    getDateTimeString,
  });
});

export const getDashboard = catchAsync(async (req, res) => {
  let { clientsCount, leadsCount, closedCases, activeCases, numberOfDays } =
    req;

  // If these values are not already set, fetch the data for the last 7 days
  if (
    clientsCount === undefined ||
    leadsCount === undefined ||
    closedCases === undefined ||
    activeCases === undefined
  ) {
    clientsCount = await Client.countDocuments({
      isLead: false,
    });

    leadsCount = await Client.countDocuments({
      isLead: true,
    });

    closedCases = await Case.countDocuments({
      caseStatus: { $in: ["Cancelled", "Closed-Win", "Closed-Lost"] },
    });

    activeCases = await Case.countDocuments({
      caseStatus: { $nin: ["Cancelled", "Closed-Win", "Closed-Lost"] },
    });
  }

  const inProgressCases = await Case.countDocuments({
    caseStatus: "In Progress",
  });
  const underReviewCases = await Case.countDocuments({
    caseStatus: "Under Review",
  });
  const referredCases = await Case.countDocuments({
    caseStatus: "Referred",
  });
  const pendingCases = await Case.countDocuments({
    caseStatus: "Pending",
  });

  const myHighPriorityCases = await Case.find({
    $and: [
      { casePriority: "P3" },
      { assignedTo: req.user._id },
      { caseStatus: { $nin: ["Cancelled", "Closed-Win", "Closed-Lost"] } },
    ],
  });

  const date = new Date();

  // Get today's date in the desired format
  let day = date.getDate().toString().padStart(2, "0");
  let month = (date.getMonth() + 1).toString().padStart(2, "0");
  let year = date.getFullYear();

  let currentDate = `${year}-${month}-${day}`;

  // Calculate tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  let tomorrowDay = tomorrow.getDate().toString().padStart(2, "0");
  let tomorrowMonth = (tomorrow.getMonth() + 1).toString().padStart(2, "0");
  let tomorrowYear = tomorrow.getFullYear();

  let tomorrowDate = `${tomorrowYear}-${tomorrowMonth}-${tomorrowDay}`;

  // Fetch today's tasks
  const todayTasks = await Task.find({
    $or: [{ appointmentDate: currentDate }, { due: currentDate }],
  }).select([
    "client",
    "appointmentStartTime",
    "id",
    "description",
    "completed",
    "assignedTo",
  ]);

  // Fetch tomorrow's tasks
  const tomorrowTasks = await Task.find({
    $or: [{ appointmentDate: tomorrowDate }, { due: tomorrowDate }],
  }).select([
    "client",
    "appointmentStartTime",
    "id",
    "description",
    "completed",
    "assignedTo",
  ]);

  res.status(200).render("dashboard", {
    title: "Dashboard",
    clientsCount,
    leadsCount,
    closedCases,
    activeCases,
    numberOfDays,
    todayTasks,
    tomorrowTasks,
    inProgressCases,
    underReviewCases,
    referredCases,
    pendingCases,
    getColor,
    myHighPriorityCases,
  });
});

export const getCalendar = catchAsync(async (req, res) => {
  const features = new APIFeatures(
    Task.find({
      $or: [{ assignedTo: req.user._id }, { requestedBy: req.user._id }],
    }),
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
  if (Object.keys(req.query).length === 0) {
    req.query.limit = "10";
    req.query.sort = "-createdAt";
  }
  const features = new APIFeatures(
    Task.find({
      $or: [({ requestedBy: req.user._id }, { assignedTo: req.user._id })],
    }).populate("client"),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // Get the cases based on the query
  const tasks = await features.query;

  // Ensure totalTasks is a valid number
  const totalTasks = await Task.countDocuments({
    $or: [({ requestedBy: req.user._id }, { assignedTo: req.user._id })],
  });
  const limit = parseInt(req.query.limit) || 10;
  const totalPages = Math.ceil(totalTasks / limit);

  // Determine the sort parameters for display purposes
  let sortParams = "";
  switch (req.query.sort) {
    case "createdAt":
      sortParams = "Oldest";
      break;
    case "-createdAt":
      sortParams = "Newest";
      break;
    case "-lastUpdated":
      sortParams = "Last Updated";
      break;
    case "completed":
      sortParams = "Completed";
      break;
    default:
      sortParams = "";
      break;
  }

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

export const getKnowledgeBase = catchAsync(async (req, res) => {
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
