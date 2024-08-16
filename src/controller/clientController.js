import Client from "./../model/clientModel.js";
import catchAsync from "../utils/catchAsync.js";
import User from "../model/userModel.js";

const getAllClients = catchAsync(async (req, res) => {
  const clients = await Client.find().populate([
    "cases",
    "consultant",
    "lastUpdatedBy",
  ]);
  res.status(200).json({
    status: "success",
    results: clients.length,
    data: { clients },
  });
});

const getClient = catchAsync(async (req, res) => {
  const client = await Client.findById(req.params.id).populate([
    "cases",
    "consultant",
    "lastUpdatedBy",
  ]);
  res.status(200).json({ status: "success", data: { client } });
});

const createClient = catchAsync(async (req, res) => {
  const consultant = await User.findOne({ name: req.body.consultantName });
  const newClient = await Client.create({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    consultant: consultant._id, // Save the ObjectId of the consultant
    clientNote: req.body.clientNote,
    visaType: req.body.visaType,
    city: req.body.city,
    province: req.body.province,
    postalCode: req.body.postalCode,
    createdBy: req.body.createdBy,
    createdAt: req.body.createdAt,
  });

  res.status(201).json({
    status: "success",
    data: { client: newClient },
  });
});

const updateClient = catchAsync(async (req, res, next) => {
  const consultant = await User.findOne({ name: req.body.consultantName });
  const updatedClient = await Client.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      consultant: consultant._id, // Save the ObjectId of the consultant
      clientNote: req.body.clientNote,
      visaType: req.body.visaType,
      city: req.body.city,
      province: req.body.province,
      postalCode: req.body.postalCode,
      createdBy: req.body.createdBy,
      createdAt: req.body.createdAt,
      lastUpdatedAt: req.body.lastUpdatedAt,
      lastUpdatedBy: req.body.lastUpdatedBy,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: { client: updatedClient },
  });
});

const getDataForLastDays = catchAsync(async (req, res) => {
  const days = parseInt(req.params.days);

  if (![7, 30, 90].includes(days)) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid number of days. Must be 7, 30, or 90.",
    });
  }

  const date = new Date();
  date.setDate(date.getDate() - days);

  const data = await Client.find({
    createdAt: { $gte: date },
  });

  res.status(200).json({
    status: "success",
    results: data.length,
    data: { data },
  });
});

export {
  getAllClients,
  createClient,
  getClient,
  getDataForLastDays,
  updateClient,
};
