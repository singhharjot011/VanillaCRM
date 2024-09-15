import mongoose from "mongoose";
import dotenv from "dotenv";

import app from "./app.js";

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "PASSWORD",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connection Successful"))
  .catch((err) => console.error("DB Connection Error:", err));

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  Server.close(() => {
    console.log("💣 Process terminated!");
  });
});
