import Employee from "../model/employeeModel.js";

const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json({
      status: "success",
      results: employees.length,
      data: { employees },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

export default getAllEmployees;
