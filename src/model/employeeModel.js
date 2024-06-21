import mongoose from "mongoose";
const employeeSchema = new mongoose.Schema({
  employeeId: String,
  name: {
    type: String,
    required: [true, "Employee Name is required"],
    unique: true,
  },
  position: {
    type: String,
    required: [true, "Employee Position is required"],
  },
  username: {
    type: String,
    required: [true, "Employee Username is required"],
    unique: true,
  },
  password: String,
  img: String,
  createdAt: {
    type: Date,
    default: new Date().toISOString(),
  },
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
});

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
