import Client from "./../model/clientModel.js";
import Case from "./../model/caseModel.js";
import catchAsync from "../src/utils/catchAsync.js";

export const aliasLast7Days = catchAsync(async (req, res, next) => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const clientsCountLastWeek = await Client.countDocuments({
    createdAt: { $gt: oneWeekAgo },
    isLead: false,
  });

  const leadsCountLastWeek = await Client.countDocuments({
    createdAt: { $gt: oneWeekAgo },
    isLead: true,
  });

  const closedCasesLastWeek = await Case.countDocuments({
    createdAt: { $gt: oneWeekAgo },
    caseStatus: { $in: ["Cancelled", "Closed-Win", "Closed-Lost"] },
  });

  const activeCasesLastWeek = await Case.countDocuments({
    createdAt: { $gt: oneWeekAgo },
    caseStatus: { $nin: ["Cancelled", "Closed-Win", "Closed-Lost"] },
  });

  

  // Attach the counts to the req object
  req.clientsCount = clientsCountLastWeek;
  req.leadsCount = leadsCountLastWeek;
  req.closedCases = closedCasesLastWeek;
  req.activeCases = activeCasesLastWeek;
  req.numberOfDays = 7;

  next();
});

export const aliasLast30Days = catchAsync(async (req, res, next) => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

  const clientsCountLastMonth = await Client.countDocuments({
    createdAt: { $gt: oneMonthAgo },
    isLead: false,
  });

  const leadsCountLastMonth = await Client.countDocuments({
    createdAt: { $gt: oneMonthAgo },
    isLead: true,
  });

  const closedCasesLastMonth = await Case.countDocuments({
    createdAt: { $gt: oneMonthAgo },
    caseStatus: { $in: ["Cancelled", "Closed-Win", "Closed-Lost"] },
  });

  const activeCasesLastMonth = await Case.countDocuments({
    createdAt: { $gt: oneMonthAgo },
    caseStatus: { $nin: ["Cancelled", "Closed-Win", "Closed-Lost"] },
  });

  // Attach the counts to the req object
  req.clientsCount = clientsCountLastMonth;
  req.leadsCount = leadsCountLastMonth;
  req.closedCases = closedCasesLastMonth;
  req.activeCases = activeCasesLastMonth;
  req.numberOfDays = 30;

  next();
});
export const aliasLast90Days = catchAsync(async (req, res, next) => {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 90);

  const clientsCountLastWeek = await Client.countDocuments({
    createdAt: { $gt: threeMonthsAgo },
    isLead: false,
  });

  const leadsCountLastWeek = await Client.countDocuments({
    createdAt: { $gt: threeMonthsAgo },
    isLead: true,
  });

  const closedCasesLastWeek = await Case.countDocuments({
    createdAt: { $gt: threeMonthsAgo },
    caseStatus: { $in: ["Cancelled", "Closed-Win", "Closed-Lost"] },
  });

  const activeCasesLastWeek = await Case.countDocuments({
    createdAt: { $gt: threeMonthsAgo },
    caseStatus: { $nin: ["Cancelled", "Closed-Win", "Closed-Lost"] },
  });

  // Attach the counts to the req object
  req.clientsCount = clientsCountLastWeek;
  req.leadsCount = leadsCountLastWeek;
  req.closedCases = closedCasesLastWeek;
  req.activeCases = activeCasesLastWeek;
  req.numberOfDays = 90;

  next();
});
