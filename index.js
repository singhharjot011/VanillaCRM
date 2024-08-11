import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import clientRouter from "./routes/clientRoutes.js";
import employeeRouter from "./routes/employeeRoutes.js";
import caseRouter from "./routes/caseRoutes.js";
import eventRouter from "./routes/eventRoutes.js";
import taskRouter from "./routes/taskRoutes.js";
import userRouter from "./routes/userRoutes.js";
import xss from "xss-clean";
import hpp from "hpp";
import cors from "cors";
import appError from "./src/utils/appError.js";
import { globalErrorHandler } from "./src/controller/errorController.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import ExpressMongoSanitize from "express-mongo-sanitize";

dotenv.config({ path: "./config.env" });

const app = express(); // Initialize express app here
const PORT = process.env.PORT || 8000;

app.use(express.json());

// 1) GLOBAL MIDDLEWARES

//  Set security http header
app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from 1 IP
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too Many requests from this IP. Please try again in an hour!",
});

app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

// Data Sanitization against NoSQL Query injection
app.use(ExpressMongoSanitize());

// Data Sanitization against XSS Attack
app.use(xss());

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

app.use(
  hpp({
    whitelist: [
      // Will Add later after doing sort feature
    ],
  })
);

app.use(cors(corsOptions)); // Apply CORS middleware after initializing app

app.use("/api/v1/clients", clientRouter);
app.use("/api/v1/employees", employeeRouter);
app.use("/api/v1/cases", caseRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/users", userRouter);

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

app.all("*", (req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
