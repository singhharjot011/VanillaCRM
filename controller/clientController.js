import Client from "./../model/clientModel.js";
import catchAsync from "../src/utils/catchAsync.js";
import User from "../model/userModel.js";
import { deleteOne, getAll, getOne, getOneByName } from "./handlerFactory.js";

const getAllClients = getAll(Client, [
  "cases",
  "consultant",
  "lastUpdatedBy",
  "tasks",
]);


const getClient = getOne(Client, [
  "cases",
  "consultant",
  "lastUpdatedBy",
  "tasks",
]);

const getClientByName = getOneByName(Client);

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
    createdAt: req.body.createdAt,
    province: req.body.province,
    postalCode: req.body.postalCode,
    createdBy: req.user._id,
  });

  res.status(201).json({
    status: "success",
    data: { client: newClient },
  });
});

const updateClient = catchAsync(async (req, res, next) => {
  // Find the consultant
  const consultant = await User.findOne({ name: req.body.consultantName });

  if (!consultant) {
    return res.status(404).json({
      status: "fail",
      message: "Consultant not found",
    });
  }

  // Prepare update object
  const updateData = {
    lastUpdatedAt: new Date(),
    lastUpdatedBy: req.user._id,
    consultant: consultant._id,
  };

  // Add other fields if they exist in req.body
  const fields = [
    "name",
    "email",
    "phone",
    "clientNote",
    "visaType",
    "city",
    "province",
    "postalCode",
  ];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  // Update the client
  const updatedClient = await Client.findOneAndUpdate(
    { _id: req.body._id },
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedClient) {
    return res.status(404).json({
      status: "fail",
      message: "Client not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: { client: updatedClient },
  });
});

const deleteClient = deleteOne(Client);


export {
  getAllClients,
  createClient,
  getClient,
  updateClient,
  deleteClient,
  getClientByName,
};
