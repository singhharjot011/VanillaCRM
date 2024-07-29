import express from "express";
import morgan from "morgan";

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());

app.use((req, res, next) => {
  console.log("Hello from middleware ");
  next();
});

//  Start Server

export default app;
