import User from "../model/userModel.js";
import catchAsync from "../src/utils/catchAsync.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import AppError from "../src/utils/appError.js";
import { promisify } from "util";
// import { sendEmail } from "../src/utils/email.js";
import { Email } from "../src/utils/email.js";
import { getDashboard, getLoginForm } from "./viewsController.js";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  // Remove password from output
  user.password = undefined;

  res
    .status(statusCode)
    .json({ status: "success", token, data: { user: user } });
};

const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  const url = `${req.protocol}://${req.hostname}:5000/me`;
  await new Email(newUser, url).sendWelcome();

  // const newUser = await User.create({
  //   name: req.body.name,
  //   email: req.body.email,
  //   role: req.body.role,
  //   photo: req.body.photo,
  //   password: req.body.password,
  //   passwordConfirm: req.body.passwordConfirm,
  // });

  createSendToken(newUser, 201, req, res);
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  // 2) Check if email and password exist
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, req, res);
});

const isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) Verify Jwt

      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // There is a Logged In User
      res.locals.user = currentUser;

      return next();
    } catch (error) {
      return next();
    }
  }

  next();
};

const logout = (req, res, next) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

const protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    console.log("No token found");
    location.assign("/login");
    return next(
      new AppError("You are not logged in! Please log in to get access", 401)
    );
  }

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      console.log("User not found");
      return next(
        new AppError("The token belonging to this user does no longer exist")
      );
    }

    if (freshUser.changedPasswordAfter(decoded.iat)) {
      console.log("Password changed");
      return next(
        new AppError("User recently changed password, please login again", 401)
      );
    }

    req.user = freshUser;

    next();
  } catch (err) {
    next(err);
  }
});

// const redirectBasedOnAuth = (req, res, next) => {
//   if (res.locals.user) {
//     // User is logged in, render the dashboard
//     return getDashboard(req, res, next); // Render the dashboard directly
//   } else {
//     // User is not logged in, render the login form
//     return getLoginForm(req, res, next); // Render the login form directly
//   }
// };

const redirectBasedOnAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    console.log("No token found");
    return getLoginForm(req, res, next); // Render the login form directly
  }

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      console.log("User not found");
      return getLoginForm(req, res, next); // Render the login form directly
    }

    if (freshUser.changedPasswordAfter(decoded.iat)) {
      console.log("Password changed");
      return getLoginForm(req, res, next); // Render the login form directly
    }

    req.user = freshUser;

    // User is logged in, render the dashboard
    return getDashboard(req, res, next); // Render the dashboard directly
  } catch (err) {
    return next(err); // Handle errors and redirect to login
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles  ['admin','lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    // await sendEmail({
    //   email: user.email,
    //   subject: "Your password reset token (valid for 10 min)",
    //   message,
    // });

    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is a user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  // 3) Update changedPasswordAt property for the user

  // 4) Log the user in, send JWT

  createSendToken(user, 201, req, res);
});

const updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection

  const user = await User.findById(req.user.id).select("+password");

  // 2) Check if posted password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  // 3) If so, update Password

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  // 4) Log user in, send JWT

  createSendToken(user, 200, req, res);
});

export {
  signup,
  login,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
  restrictTo,
  isLoggedIn,
  logout,
  redirectBasedOnAuth,
};
