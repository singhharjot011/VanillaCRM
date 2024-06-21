import mongoose from "mongoose";

const caseNotesSchema = new mongoose.Schema({
  note: {
    type: String,
    trim: true,
  },
  writtenBy: String,
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
    type: String,
    required: [true, "Consultant Name is required"],
  },
  clientId: {
    type: String,
    required: [true, "Client should be selected"],
  },
  notes: {
    type: [caseNotesSchema],
    default: undefined,
  },
  createdAt: {
    type: Date,
    default: new Date().toISOString(),
  },
});

const Case = mongoose.model("Case", caseSchema);

export default Case;
