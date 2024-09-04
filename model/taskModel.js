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
  completedBy: {
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
  taskPriority: {
    type: String,
    enum: ["P1", "P2", "P3"],
    default: "P1",
  },
  createdAt: {
    type: Date,
    default: new Date(),
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

taskSchema.virtual("calendarEvent").get(function () {
  return {
    id: this.id,
    title: this.description,
    start: this.isAppointment ? this.appointmentStart : this.dueDate,
    end: this.isAppointment ? this.appointmentEnd : this.dueDate,
    classNames: [
      this.isAppointment ? "appointment" : "task",
      this.completed ? "completed" : "",
    ],
    extendedProps: {
      appointmentAgenda: this.appointmentAgenda,
      taskDescription: this.description,
      clientName: this.client ? this.client.name : "",
      assignedToName: this.assignedTo ? this.assignedTo.name : "",
      requestedByName: this.requestedBy ? this.requestedBy.name : "",
      isCompleted: this.completed,
    },
  };
});

// Include virtuals in JSON and object conversion
taskSchema.set("toJSON", { virtuals: true });
taskSchema.set("toObject", { virtuals: true });
taskSchema.pre("save", async function (next) {
  if (!this.id) {
    const count = await mongoose.model("Task").countDocuments();
    const uniquePart = Date.now().toString().slice(-4);
    this.id = `T${10 + count + 1}${uniquePart}`;
  }
  next();
});

taskSchema.pre(/^find/, function (next) {
  this.populate({
    path: "client",
    select: "name phone email visaType",
  }).populate({ path: "requestedBy assignedTo completedBy", select: "name" });
  next();
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
