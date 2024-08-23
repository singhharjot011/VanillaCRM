import path from "path";
import { fileURLToPath } from "url";

import express from "express";
import AppError from "./src/utils/appError.js";

import clientRouter from "./routes/clientRoutes.js";
import employeeRouter from "./routes/employeeRoutes.js";
import caseRouter from "./routes/caseRoutes.js";
import eventRouter from "./routes/eventRoutes.js";
import taskRouter from "./routes/taskRoutes.js";
import userRouter from "./routes/userRoutes.js";
import xss from "xss-clean";
import hpp from "hpp";
import { globalErrorHandler } from "./src/controller/errorController.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import ExpressMongoSanitize from "express-mongo-sanitize";
import viewRouter from "./routes/viewRoutes.js";
import cookieParser from "cookie-parser";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// 1) GLOBAL MIDDLEWARES

// Serving Static Files
app.use(express.static(path.join(__dirname, "public")));

//  Set security http header
app.use(helmet({ contentSecurityPolicy: false }));

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
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Data Sanitization against NoSQL Query injection
app.use(ExpressMongoSanitize());

// Data Sanitization against XSS Attack
app.use(xss());

app.use(
  hpp({
    whitelist: [
      // Will Add later after doing sort feature
    ],
  })
);

// Test Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

// ROUTES

app.use("/", viewRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/clients", clientRouter);
app.use("/api/v1/employees", employeeRouter);
app.use("/api/v1/cases", caseRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/tasks", taskRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
