import Case from "../model/caseModel.js";
import Client from "../model/clientModel.js";
import User from "../model/userModel.js";
import catchAsync from "../utils/catchAsync.js";

const getAllCases = async (req, res) => {
  try {
    const cases = await Case.find();
    res.status(200).json({
      status: "success",
      results: cases.length,
      data: { cases },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

const getCase = async (req, res) => {
  try {
    const curCase = await Case.findById(req.params.id);
    res.status(200).json({ status: "success", data: { curCase } });
  } catch (err) {
    return {
      status: "fail",
      message: err.message,
    };
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

  const notes = req.body.notes?.map(async (note) => {
    const writtenByData = note.writtenByName
      ? await User.findOne({ name: note.writtenByName })
      : undefined;
    return { ...note, writtenBy: writtenByData?._id };
  });

  const updatedNotes = notes ? await Promise.all(notes) : undefined;

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
  const consultant = req.body.consultantName
    ? await User.findOne({ name: req.body.consultantName })
    : undefined;
  const client = req.body.clientName
    ? await Client.findOne({ name: req.body.clientName })
    : undefined;

  const notes = req.body.notes?.map(async (note) => {
    const writtenByData = note.writtenByName
      ? await User.findOne({ name: note.writtenByName })
      : undefined;
    return { ...note, writtenBy: writtenByData?._id };
  });

  const updatedNotes = notes ? await Promise.all(notes) : undefined;

  const newCase = await Case.create({
    caseType: req.body.caseType,
    caseDescription: req.body.caseDescription,
    caseStatus: req.body.caseStatus,
    assignedTo: consultant?._id,
    client: client?._id,
    notes: updatedNotes,
    createdAt: req.body.createdAt,
  });
  res.status(201).json({
    status: "success",
    data: { client: newCase },
  });
});

export { getAllCases, getCase, createCase, getDataForLastDays, updateCase };
