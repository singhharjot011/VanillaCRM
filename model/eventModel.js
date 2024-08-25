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
  assignedTo: { type: mongoose.Schema.ObjectId, ref: "User" },
  requestedBy: { type: mongoose.Schema.ObjectId, ref: "Client" },
  task: { type: mongoose.Schema.ObjectId, ref: "Task" },
  classNames: [String],
  client: { type: mongoose.Schema.ObjectId, ref: "Client" },
  createdAt: {
    type: Date,
    default: new Date().toISOString(),
  },
});

eventsSchema.pre(/^find/, function (next) {
  this.populate({
    path: "client",
    select: "name phone email visaType",
  })
    .populate({ path: "requestedBy assignedTo", select: "name" })
    .populate({ path: "task", select: "_id id" });
  next();
});

eventsSchema.pre("save", async function (next) {
  if (!this.id) {
    const count = await mongoose.model("Event").countDocuments();
    this.id = `A${100 + count + 1}`;
  }
  next();
});

const Event = mongoose.model("Event", eventsSchema);

export default Event;
