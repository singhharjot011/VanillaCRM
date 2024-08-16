import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  clientId: {
    type: String,
  },
  assignedTo: {
    type: String,
    required: [true, "Consultant Name is required"],
  },
  requestedBy: {
    type: String,
    required: [true, "Consultant Name is required"],
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



const Task = mongoose.model("Task", taskSchema);

export default Task;
