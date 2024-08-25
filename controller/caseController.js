import Case from "../model/caseModel.js";
import Client from "../model/clientModel.js";
import User from "../model/userModel.js";
import catchAsync from "../src/utils/catchAsync.js";
import { getAll, getOne } from "./handlerFactory.js";

const getAllCases = getAll(Case);

const getCase = getOne(Case);

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

  const writtenByName = req.body.notes.at(-1)?.writtenByName;
  const writtenBy = writtenByName
    ? await User.findOne({ name: writtenByName })
    : undefined;

  // Update only the last note in the array
  const updatedNotes = req.body.notes.map(
    (note, index, array) =>
      index === array.length - 1
        ? { ...note, writtenBy: writtenBy ? writtenBy._id : undefined } // Update last note
        : note // Keep other notes unchanged
  );

  const caseEntity = await Case.findByIdAndUpdate(
    req.params.id,
    {
      caseType: req.body.caseType,
      caseDescription: req.body.caseDescription,
      caseStatus: req.body.caseStatus,
      assignedTo: consultant?._id,
      client: client?._id,
      notes: updatedNotes,
      createdAt: req.body.createdAt,
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

  // Find writtenBy user for the first note
  const writtenByName = req.body.notes[0]?.writtenByName;
  const writtenBy = writtenByName
    ? await User.findOne({ name: writtenByName })
    : undefined;

  // Map notes to include the writtenBy field
  const notes = req.body.notes.map((note) => ({
    ...note,
    writtenBy: writtenBy ? writtenBy._id : undefined, // Assign writtenBy as user ID
  }));

  // Create a new case
  const newCase = await Case.create({
    caseType: req.body.caseType,
    caseDescription: req.body.caseDescription,
    caseStatus: req.body.caseStatus,
    assignedTo: consultant?._id,
    client: client?._id,
    notes,
    createdAt: req.body.createdAt,
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

export { getAllCases, getCase, createCase, getDataForLastDays, updateCase };
