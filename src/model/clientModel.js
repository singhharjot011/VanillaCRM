import mongoose from "mongoose";
const clientSchema = new mongoose.Schema({
  id: String,
  name: {
    type: String,
    required: [true, "Client Name is required"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Client Email is required"],
    unique: true,
  },
  phone: {
    type: Number,
    required: [true, "Client Number is required"],
    unique: true,
  },
  consultant: {
    type: String,
    required: [true, "Consultant should be assigned"],
  },
  clientNote: {
    type: String,
    trim: true,
  },
  visaType: String,
  city: String,
  province: String,
  postalCode: String,
  createdAt: {
    type: Date,
    default: new Date().toISOString(),
  },
  isLead: {
    type: Boolean,
    default: true,
  },
});

const Client = mongoose.model("Client", clientSchema);

export default Client;
