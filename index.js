import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import clientRouter from "./routes/clientRoutes.js";
import employeeRouter from "./routes/employeeRoutes.js";
import caseRouter from "./routes/caseRoutes.js";
import eventRouter from "./routes/eventRoutes.js";
import taskRouter from "./routes/taskRoutes.js";
import cors from "cors";

dotenv.config({ path: "./config.env" });

const app = express(); // Initialize express app here
const PORT = process.env.PORT || 8000;

app.use(express.json());

// Allow requests from specific origin (replace with your frontend URL)
const allowedOrigins = ["http://127.0.0.1:5500"];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions)); // Apply CORS middleware after initializing app

app.use("/api/v1/clients", clientRouter);
app.use("/api/v1/employees", employeeRouter);
app.use("/api/v1/cases", caseRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/tasks", taskRouter);

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connection Successful"))
  .catch((err) => console.error("DB Connection Error:", err));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});