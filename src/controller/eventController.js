import Event from "../model/EventModel.js";

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({
      status: "success",
      results: events.length,
      data: { events },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

const createEvent = async (req, res) => {
  try {
    const newEvent = await Event.create(req.body);

    res.status(201).json({
      status: "success",
      data: { event: newEvent },
    });
  } catch (err) {
    return {
      status: "fail",
      message: err.message,
    };
  }
};

const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    res.status(200).json({ status: "success", data: { event } });
  } catch (err) {
    return {
      status: "fail",
      message: err.message,
    };
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ status: "success", data: { event } });
  } catch (err) {
    return {
      status: "fail",
      message: err.message,
    };
  }
};

const deleteEvent = async (req, res) => {
  try {
    return null;
  } catch (err) {
    return {
      status: "fail",
      message: err.message,
    };
  }
};

export { getAllEvents, createEvent, getEvent, updateEvent, deleteEvent };
