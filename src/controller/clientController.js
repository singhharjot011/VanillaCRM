import Client from "./../model/clientModel.js";
import catchAsync from "../utils/catchAsync.js";

const getAllClients = catchAsync(async (req, res) => {
  const clients = await Client.find();
  res.status(200).json({
    status: "success",
    results: clients.length,
    data: { clients },
  });
});

const getClient = catchAsync(async (req, res) => {
  const client = await Client.findById(req.params.id);
  res.status(200).json({ status: "success", data: { client } });
});

const createClient = catchAsync(async (req, res) => {
  const newClient = await Client.create(req.body);

  res.status(201).json({
    status: "success",
    data: { client: newClient },
  });
});

const updateClient = catchAsync(async (req, res, next) => {
  const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ status: "success", data: { client } });
  next();
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
