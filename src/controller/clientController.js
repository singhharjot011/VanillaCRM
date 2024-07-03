import Client from "./../model/clientModel.js";

const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json({
      status: "success",
      results: clients.length,
      data: { clients },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

const getClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    res.status(200).json({ status: "success", data: { client } });
  } catch (err) {
    return {
      status: "fail",
      message: err.message,
    };
  }
};

const createClient = async (req, res) => {
  try {
    const newClient = await Client.create(req.body);

    res.status(201).json({
      status: "success",
      data: { client: newClient },
    });
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

    const data = await Client.find({
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

export { getAllClients, createClient, getClient, getDataForLastDays };
