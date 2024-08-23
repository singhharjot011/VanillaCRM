import express from "express";
import {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
} from "../src/controller/userController.js";
import {
  login,
  signup,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
  restrictTo,
  logout,
} from "../src/controller/authController.js";

const userRouter = express.Router();

userRouter.post("/login", login);
userRouter.post("/signup", signup);
userRouter.get("/logout", logout);

userRouter.post("/forgotPassword", forgotPassword);
userRouter.patch("/resetPassword/:token", resetPassword);

// userRouter.use(protect);

userRouter.patch("/updateMyPassword", protect, updatePassword);

userRouter.get("/me", protect, getMe, getUser);
userRouter.patch("/updateMe", protect, updateMe);
userRouter.delete("/deleteMe", protect, deleteMe);

// userRouter.use(restrictTo('manager'))

userRouter.route("/").get(getAllUsers).post(createUser);
userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default userRouter;
