import express from "express";
import {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
} from "../src/controller/userController.js";
import {
  login,
  signup,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
} from "../src/controller/authController.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);

userRouter.post("/forgotPassword", forgotPassword);
userRouter.patch("/resetPassword/:token", resetPassword);
userRouter.patch("/updateMyPassword", protect, updatePassword);

userRouter.patch("/updateMe", protect, updateMe);
userRouter.delete("/deleteMe", protect, deleteMe);

userRouter.route("/").get(getAllUsers).post(createUser);
userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default userRouter;
