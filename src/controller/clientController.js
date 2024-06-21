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

export { getAllClients, createClient };

