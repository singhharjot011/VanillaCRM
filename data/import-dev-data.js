import fs from "fs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Client from "./../src/model/clientModel.js";
import Employee from "./../src/model/employeeModel.js";
import Case from "../src/model/caseModel.js";
import Task from "../src/model/taskModel.js";
import Event from "../src/model/eventModel.js";

dotenv.config({ path: "./../config.env" });

console.log(process.env);

const DB =
  "mongodb+srv://harjot:Sum%21mer%40@cluster0.ga83gzs.mongodb.net/CRM?retryWrites=true&w=majority&appName=Cluster0";

// const DB = process.env.DATABASE.replace(
//   "<PASSWORD>",
//   process.env.DATABASE_PASSWORD
// );

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connection Successful"));

// Read JSON File
const clients = JSON.parse(
  fs.readFileSync(new URL("./clients-simple.json", import.meta.url), "utf-8")
);

const employees = JSON.parse(
  fs.readFileSync(new URL("./employees-simple.json", import.meta.url), "utf-8")
);

const cases = JSON.parse(
  fs.readFileSync(new URL("./cases-simple.json", import.meta.url), "utf-8")
);

const tasks = JSON.parse(
  fs.readFileSync(new URL("./tasks-simple.json", import.meta.url), "utf-8")
);

const events = JSON.parse(
  fs.readFileSync(new URL("./events-simple.json", import.meta.url), "utf-8")
);

// ------ CLIENTS DATA

// Import Data into DB
const importClientsData = async () => {
  try {
    await Client.create(clients);
    console.log("Clients Data Successfully Loaded");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete All Data from DB
const deleteClientsData = async () => {
  try {
    await Client.deleteMany();
    console.log("Clients Data Successfully Deleted");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// ------ EMPLOYEES DATA

// Import Data into DB
const importEmployeesData = async () => {
  try {
    await Employee.create(employees);
    console.log("Employee Data Successfully Loaded");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete All Data from DB
const deleteEmployeesData = async () => {
  try {
    await Employee.deleteMany();
    console.log("Employee Data Successfully Deleted");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// ------ Cases DATA

// Import Data into DB
const importCasesData = async () => {
  try {
    await Case.create(cases);
    console.log("Cases Data Successfully Loaded");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete All Data from DB
const deleteCasesData = async () => {
  try {
    await Case.deleteMany();
    console.log("Employee Data Successfully Deleted");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// ------ Tasks DATA

// Import Data into DB
const importTasksData = async () => {
  try {
    await Task.create(tasks);
    console.log("Tasks Data Successfully Loaded");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete All Data from DB
const deleteTasksData = async () => {
  try {
    await Task.deleteMany();
    console.log("Tasks Data Successfully Deleted");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// ------ EVENTS DATA

// Import Data into DB
const importEventsData = async () => {
  try {
    await Event.create(events);
    console.log("Events Data Successfully Loaded");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete All Data from DB
const deleteEventsData = async () => {
  try {
    await Event.deleteMany();
    console.log("Events Data Successfully Deleted");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === "--import-clients") {
  importClientsData();
} else if (process.argv[2] === "--delete-clients") {
  deleteClientsData();
} else if (process.argv[2] === "--import-employees") {
  importEmployeesData();
} else if (process.argv[2] === "--delete-employees") {
  deleteEmployeesData();
} else if (process.argv[2] === "--import-cases") {
  importCasesData();
} else if (process.argv[2] === "--delete-cases") {
  deleteCasesData();
} else if (process.argv[2] === "--import-tasks") {
  importTasksData();
} else if (process.argv[2] === "--delete-tasks") {
  deleteTasksData();
} else if (process.argv[2] === "--import-events") {
  importEventsData();
} else if (process.argv[2] === "--delete-events") {
  deleteEventsData();
}
