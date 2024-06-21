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

export default getAllEvents;
