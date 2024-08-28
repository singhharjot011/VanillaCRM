import Case from "../model/caseModel.js";
import Client from "../model/clientModel.js";
import User from "../model/userModel.js";
import catchAsync from "../src/utils/catchAsync.js";
import { getAll, getOne } from "./handlerFactory.js";

const getAllCases = getAll(Case);

const getCase = getOne(Case);

const getCaseByCaseId = async (req, res, next) => {
  try {
    const caseData = await Case.findOne({ caseId: req.query.caseId });
    if (!caseData) {
      return next();
    }

    res.status(200).json({ status: "success", data: { case: caseData } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

const getDataForLastDays = async (req, res) => {
  try {
    const days = parseInt(req.params.days);

    if (![7, 30, 90].includes(days)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid number of days. Must be 7, 30, or 90.",
      });
    }

    const date = new Date();
    date.setDate(date.getDate() - days);

    const data = await Case.find({
      createdAt: { $gte: date },
    });

    res.status(200).json({
      status: "success",
      results: data.length,
      data: { data },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: "Invalid Data sent" });
  }
};

const updateCase = catchAsync(async (req, res, next) => {
  const consultant = req.body.consultantName
    ? await User.findOne({ name: req.body.consultantName })
    : undefined;
  const client = req.body.clientName
    ? await Client.findOne({ name: req.body.clientName })
    : undefined;

  const existingCase = await Case.findById(req.originalId);

  if (!existingCase) {
    return res.status(404).json({ status: "fail", message: "Case not found" });
  }

  const newNote = {
    note: req.body.note,
    writtenBy: req.user._id,
  };

  const caseEntity = await Case.findByIdAndUpdate(
    req.originalId,
    {
      caseType: req.body.caseType,
      caseDescription: req.body.caseDescription,
      caseStatus: req.body.caseStatus,
      assignedTo: consultant?._id,
      client: client?._id,
      notes: newNote ? [...existingCase.notes, newNote] : existingCase.notes,
      createdAt: req.body.createdAt,
      createdBy: req.user._id,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({ status: "success", data: { caseEntity } });
  next();
});

const createCase = catchAsync(async (req, res) => {
  // Find consultant and client
  const consultant = req.body.consultantName
    ? await User.findOne({ name: req.body.consultantName })
    : undefined;

  const client = req.body.clientName
    ? await Client.findOne({ name: req.body.clientName })
    : undefined;

  // Map notes to include the writtenBy field
  const newNote = { note: req.body.note, writtenBy: req.user._id };

  // Create a new case
  const newCase = await Case.create({
    caseType: req.body.caseType,
    caseDescription: req.body.caseDescription,
    caseStatus: req.body.caseStatus,
    assignedTo: consultant?._id,
    client: client?._id,
    notes: [newNote],
    createdAt: req.body.createdAt,
    createdBy: req.user._id,
  });

  // Update the client's isLead field to false
  if (client) {
    await Client.findByIdAndUpdate(client._id, { isLead: false });
  }

  // Send response
  res.status(201).json({
    status: "success",
    data: { client: newCase },
  });
});

export {
  getAllCases,
  getCase,
  createCase,
  getDataForLastDays,
  updateCase,
  getCaseByCaseId,
};
