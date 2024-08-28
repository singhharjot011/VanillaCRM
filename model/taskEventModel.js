import mongoose from "mongoose";

const taskEventSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, "Task description is required"],
  },
  dueDate: Date,
  isAppointment: {
    type: Boolean,
    default: false,
  },
  appointmentStart: Date,
  appointmentEnd: Date,
  client: { type: mongoose.Schema.ObjectId, ref: "Client" },
  assignedTo: { type: mongoose.Schema.ObjectId, ref: "User" },
  requestedBy: { type: mongoose.Schema.ObjectId, ref: "User" },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: Date,
  taskCompletionNotes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

// Virtual for calendar event representation
taskEventSchema.virtual("calendarEvent").get(function () {
  return {
    id: this._id,
    title: this.description,
    start: this.isAppointment ? this.appointmentStart : this.dueDate,
    end: this.isAppointment ? this.appointmentEnd : this.dueDate,
    classNames: [
      this.isAppointment ? "appointment" : "task",
      this.completed ? "completed" : "",
    ],
    extendedProps: {
      clientName: this.client ? this.client.name : "",
      assignedToName: this.assignedTo ? this.assignedTo.name : "",
      requestedByName: this.requestedBy ? this.requestedBy.name : "",
      isCompleted: this.completed,
    },
  };
});

// Pre-find middleware to populate references
taskEventSchema.pre(/^find/, function (next) {
  this.populate("client", "name")
    .populate("assignedTo", "name")
    .populate("requestedBy", "name");
  next();
});

const TaskEvent = mongoose.model("TaskEvent", taskEventSchema);

export default TaskEvent;
