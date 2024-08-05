import Case from "../model/caseModel.js";
import catchAsync from "../utils/catchAsync.js";

const getAllCases = async (req, res) => {
  try {
    const cases = await Case.find();
    res.status(200).json({
      status: "success",
      results: cases.length,
      data: { cases },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

const getDataForLastDays = async (req, res) => {
  try {
    const days = parseInt(req.params.days);

    if (![7, 30, 90].includes(days)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid number of days. Must be 7, 30, or 90.",
      });
    }

    const date = new Date();
    date.setDate(date.getDate() - days);

    const data = await Case.find({
      createdAt: { $gte: date },
    });

    res.status(200).json({
      status: "success",
      results: data.length,
      data: { data },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: "Invalid Data sent" });
  }
};

const getCase = async (req, res) => {
  try {
    const curCase = await Case.findById(req.params.id);
    res.status(200).json({ status: "success", data: { curCase } });
  } catch (err) {
    return {
      status: "fail",
      message: err.message,
    };
  }
};

const updateCase = catchAsync(async (req, res, next) => {
  const caseEntity = await Case.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ status: "success", data: { caseEntity } });
  next();
});

const createCase = async (req, res) => {
  try {
    const newCase = await Case.create(req.body);

    res.status(201).json({
      status: "success",
      data: { case: newCase },
    });
  } catch (err) {
    return {
      status: "fail",
      message: err.message,
    };
  }
};

export { getAllCases, getCase, createCase, getDataForLastDays, updateCase };
