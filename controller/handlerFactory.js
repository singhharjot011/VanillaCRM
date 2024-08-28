import APIFeatures from "../src/utils/apiFeatures.js";
import AppError from "../src/utils/appError.js";
import catchAsync from "../src/utils/catchAsync.js";

export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(204).json({ status: "success", data: null });
  });

export const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({ status: "success", data: doc });
  });

export const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: doc,
    });
  });

export const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    console.log(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError("No Document found with that ID", 404));
    }

    res.status(200).json({ status: "success", data: { doc } });
  });

export const getOneByName = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    if (!req.query.name) {
      return next(); // Pass control to the next middleware
    }
    let query = Model.findOne({ name: req.query.name });

    if (popOptions) {
      query = query.populate(popOptions);
    }
    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that name", 404));
    }

    res.status(200).json({ status: "success", data: { doc } });
  });

export const getAll = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let filter = {};

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    let query = features.query;

    // Apply populate if popOptions is provided
    if (popOptions) {
      popOptions.forEach((option) => {
        query = query.populate(option);
      });
    }

    const doc = await query;

    res.status(200).json({
      status: "success",
      results: doc.length,
      data: doc,
    });
  });
