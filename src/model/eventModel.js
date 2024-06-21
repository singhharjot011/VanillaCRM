import mongoose from "mongoose";

const eventsSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  title: {
    type: String,
    trim: true,
  },
  start: { type: Date },
  end: { type: Date },
  completed: {
    type: Boolean,
    default: false,
  },
  assignedTo: {
    type: String,
    required: [true, "Consultant Name is required"],
  },
  taskId: String,
  classNames: [String],
  clientId: String,
});

const Event = mongoose.model("Event", eventsSchema);

export default Event;
