import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  assignedTo: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  requestedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  description: {
    type: String,
    trim: true,
  },
  due: {
    type: String,
  },
  taskCompletionNotes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date().toISOString(),
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
  isAppointment: {
    type: Boolean,
    default: false,
  },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: "Client",
  },
  appointmentDate: String,
  appointmentStartTime: String,
  appointmentEndTime: String,
  appointmentAgenda: {
    type: String,
    trim: true,
    default: "",
  },
});

taskSchema.pre("save", async function (next) {
  if (!this.id) {
    const count = await mongoose.model("Task").countDocuments();
    this.id = `T${100 + count + 1}`;
  }
  next();
});

taskSchema.pre(/^find/, function (next) {
  this.populate({
    path: "client",
    select: "name phone email visaType",
  }).populate({ path: "requestedBy assignedTo", select: "name" });
  next();
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
 