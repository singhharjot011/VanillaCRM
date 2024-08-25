import Case from "../model/caseModel.js";
import Client from "../model/clientModel.js";
import { handleClientObject } from "../model/model.js";
import User from "../model/userModel.js";
import AppError from "../src/utils/appError.js";
import catchAsync from "../src/utils/catchAsync.js";
import { getDateTimeString, getColor } from "../src/utils/helpers.js";

export const getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render("login", {
    title: "Login",
  });
});

export const getClientsView = catchAsync(async (req, res) => {
  // 1) Get client data from the collection and populate the consultant field
  const clients = await Client.find().populate(["consultant", "cases"]);

  // Optional: Remove sensitive information before passing to the view
  // clients.forEach(client => delete client.sensitiveField);

  // 2) Render the template using the client data

  res.status(200).render("clients", {
    title: "All Clients",
    clients,
    getDateTimeString,
  });
});

export const getMyClientsView = catchAsync(async (req, res) => {
  // 1) Get client data from the collection and populate the consultant and cases fields
  const clients = await Client.find({ consultant: req.user._id }).populate([
    "consultant",
    "cases",
  ]);

  // Optional: Remove sensitive information before passing to the view
  // clients.forEach(client => delete client.sensitiveField);

  // 2) Render the template using the client data
  res.status(200).render("myClients", {
    title: "My Clients",
    clients,
    getDateTimeString,
  });
});

export const getUserId = catchAsync(async (req, res) => {
  const userId = req.user._id;

  res.status(200).json({
    status: "success",
    data: { userId },
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
  // 2) Render the template using the client data
  res.status(200).render("client", {
    title: "Client",
    client,
    consultants,
    getDateTimeString,
  });
});

export const getAddClient = catchAsync(async (req, res) => {
  // 1) Take form data and create a new client
  // await handleClientObject(req.body);

  const consultants = await User.find();

  // 2) Render the template using the client data
  res.status(200).render("client", {
    title: "New Client",
    consultants,
    getDateTimeString,
  });
});

export const getAddCase = catchAsync(async (req, res) => {
  // 1) Take form data and create a new client
  // await handleClientObject(req.body);

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

export const getCasesView = catchAsync(async (req, res) => {
  // 1) Get case data from the collection and populate the consultant field
  const cases = await Case.find().populate("assignedTo").populate("client");

  // 2) Render the template using the client data
  res.status(200).render("cases", {
    title: "All Cases",
    cases,
    getDateTimeString,
    getColor,
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

export const getDashboard = catchAsync(async (req, res) => {
  res.status(200).render("dashboard", {
    title: "Dashboard",
  });
});

export const getCalendar = catchAsync(async (req, res) => {
  res.status(200).render("calendar", {
    title: "Calendar",
  });
});

export const getTasks = catchAsync((req, res) => {
  res.status(200).render("tasks", {
    title: "Tasks",
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
