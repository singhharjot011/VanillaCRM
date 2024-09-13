import multer from "multer";
import sharp from "sharp";
import User from "../model/userModel.js";
import AppError from "../src/utils/appError.js";
import catchAsync from "../src/utils/catchAsync.js";
import cloudinary from "./cloudinary.js";
import { getAll, getOne } from "./handlerFactory.js";

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an Image: Please upload only Images", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

export const uploadUserPhoto = upload.single("photo");

export const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}`;

  try {
    const buffer = await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toBuffer();

    const result = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream(
          {
            resource_type: "image",
            public_id: req.file.filename,
            format: "jpeg",
            asset_folder: "CRM Users",
            type: "authenticated", // Add this line
            access_mode: "authenticated", // Add this line
            upload_preset: "secure_user_photos",
            access_control: [
              { access_type: "token" }, // Token-based access
            ],
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(new AppError("Error uploading image to Cloudinary", 500));
            } else {
              resolve(result);
            }
          }
        )
        .end(buffer);
    });

    req.file.cloudinaryUrl = result.secure_url;
    next();
  } catch (error) {
    console.error("Image processing or upload error:", error);
    return next(new AppError("Error resizing or uploading image", 500));
  }
});

// Rest of the code remains the same...

// import multer from "multer";
// import sharp from "sharp";
// import User from "../model/userModel.js";
// import AppError from "../src/utils/appError.js";
// import catchAsync from "../src/utils/catchAsync.js";
// import { getAll, getOne } from "./handlerFactory.js";

// // const multerStorage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //     cb(null, "public/img/users");
// //   },
// //   filename: (req, file, cb) => {
// //     const ext = file.mimetype.split("/")[1];
// //     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
// //   },
// // });

// const multerStorage = multer.memoryStorage();

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb(new AppError("Not an Image: Please upload only Images", 400), false);
//   }
// };

// const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

// export const uploadUserPhoto = upload.single("photo");

// export const resizeUserPhoto = (req, res, next) => {
//   if (!req.file) return next();

//   req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

//   sharp(req.file.buffer)
//     .resize(500, 500)
//     .toFormat("jpeg")
//     .jpeg({ quality: 90 })
//     .toFile(`public/img/users/${req.file.filename}`);
//   next();
// };

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

const getAllUsers = getAll(User);

const getMe = (req, res, next) => {
  req.originalId = req.params.id;

  req.params.id = req.user.id;

  next();
};

const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use updateMyPassword",
        400
      )
    );
  }

  const filteredBody = filterObj(req.body, "name", "email");
  if (req.file && req.file.cloudinaryUrl) {
    filteredBody.photo = req.file.cloudinaryUrl;
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: { user: updatedUser },
  });
});

// const updateMe = catchAsync(async (req, res, next) => {
//   // 1) Create error if user POSTs password data
//   if (req.body.password || req.body.passwordConfirm) {
//     return next(
//       new AppError(
//         "This route is not for password updates, Please use updateMyPassword",
//         400
//       )
//     );
//   }

//   // 2) Update user document
//   const filteredBody = filterObj(req.body, "name", "email");
//   // if (req.file) filteredBody.photo = req.file.filename;
//   if (req.file) {
//     filteredBody.photo = req.file.buffer; // Save buffer in the DB
//   }

//   // 3) Update User document
//   const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
//     new: true,
//     runValidators: true,
//   });

//   res.status(200).json({
//     status: "success",
//     data: { user: updatedUser },
//   });
// });

const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({ status: "success", data: null });
});

const createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};

const getUser = getOne(User); 

const updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};

export {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
};
