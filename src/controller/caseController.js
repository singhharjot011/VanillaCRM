import Case from "../model/caseModel.js";

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

export { getAllCases, createCase };
