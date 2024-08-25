import mongoose from "mongoose";

const caseNotesSchema = new mongoose.Schema({
  note: {
    type: String,
    trim: true,
  },
  writtenBy: { type: mongoose.Schema.ObjectId, ref: "User" },
  writtenAt: {
    type: Date,
    default: new Date().toISOString(),
  },
});

const caseSchema = new mongoose.Schema({
  caseId: {
    type: String,
    unique: true,
  },
  caseType: {
    type: String,
    required: [true, "Case Type is required"],
  },
  caseDescription: {
    type: String,
    required: [true, "Case Description is required"],
    trim: true,
  },
  caseStatus: {
    type: String,
    required: [true, "Case Status is required"],
  },
  assignedTo: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: "Client",
  },
  notes: {
    type: [caseNotesSchema],
  },
  createdAt: {
    type: Date,
    default: new Date().toISOString(),
  },
});

caseSchema.pre("save", async function (next) {
  if (!this.caseId) {
    const count = await mongoose.model("Case").countDocuments();
    this.caseId = `C${1000 + count + 1}`;
  }
  next();
});

caseSchema.pre(/^find/, function (next) {
  this.populate({
    path: "assignedTo",
    select: "-__v -passwordChangedAt",
  }).populate({ path: "client", select: "name phone email visaType" });
  next();
});

const Case = mongoose.model("Case", caseSchema);

export default Case;
