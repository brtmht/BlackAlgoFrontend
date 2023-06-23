const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { mtAccountService, mtBrokerService, strategyService } = require('../services');
const mt4Server = require('../middlewares/mt4Server');
// Mt account crud apis
const createMtAccount = catchAsync(async (req, res) => {
  const mtAccount = await mtAccountService.createMtAccountNew(req.body);
  if (!mtAccount) {
    throw new ApiError(httpStatus.EXPECTATION_FAILED);
  }
  res.status(httpStatus.CREATED).send(mtAccount);
});

const getMtAccount = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await mtAccountService.queryMTAccount(filter, options);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND);
  }
  res.send(result);
});
const getMtAccountById = catchAsync(async (req, res) => {
  const mtAccount = await mtAccountService.getMtAccountById(req.params.mtAccountId);
  res.send(mtAccount);
});

const updateMtAccount = catchAsync(async (req, res) => {
  const mtAccount = await mtAccountService.updateMtAccountById(req.params.mtAccountId, req.body);
  if (!mtAccount) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE);
  }
  res.send(mtAccount);
});

const deleteMtAccount = catchAsync(async (req, res) => {
  await mtAccountService.deleteMtAccountById(req.params.mtAccountId);
  res.status(httpStatus.NO_CONTENT).send();
});

// mtBroker crud Apis
const createMtBroker = catchAsync(async (req, res) => {
  const mtBroker = await mtBrokerService.createMtBrokerNew(req.body);
  if (!mtBroker) {
    throw new ApiError(httpStatus.EXPECTATION_FAILED);
  }
  res.status(httpStatus.CREATED).send(mtBroker);
});

const getMtBroker = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await mtBrokerService.queryMTBroker(filter, options);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND);
  }
  res.send(result);
});
const getMtBrokerById = catchAsync(async (req, res) => {
  const mtBroker = await mtBrokerService.getMtBrokerById(req.params.mtBrokerId);
  res.send(mtBroker);
});
const updateMtBroker = catchAsync(async (req, res) => {
  const mtBrokert = await mtBrokerService.updateMtBrokerById(req.params.mtBrokerId, req.body);
  if (!mtBrokert) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE);
  }
  res.status(httpStatus.CREATED).send(mtBrokert);
});

const deleteMtBroker = catchAsync(async (req, res) => {
  await mtBrokerService.deleteMtBrokerById(req.params.mtBrokerId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getServerData = catchAsync(async (req, res) => {
  const serverData = await mt4Server.getServerData(req.body.serverName);
  res.send({"success":true, code:201 , "message":"Get broker server list Successfully", "data":serverData});
});

const FxblueScript = catchAsync(async (req, res) => {
  const response = await mt4Server.fxblueScript();
  const jsonStart = response.indexOf("{");
  const jsonEnd = response.lastIndexOf("}");
  const jsonContent = response.substring(jsonStart, jsonEnd + 1);
  const jsonObject = eval('(' + jsonContent + ')');
  await strategyService.updateStrategyByName("Conservative",{
    monthly_return_percentage: (jsonObject.monthlyBankedGrowth)/2,
    annual_return_percentage: ((jsonObject.totalBankedGrowth)/2).toFixed(2),
    max_drawdown_percentage: (jsonObject.deepestValleyPercent)/2,
    profit_factor: jsonObject.bankedProfitFactor,
  });

  await strategyService.updateStrategyByName("Balanced",{
    monthly_return_percentage: jsonObject.monthlyBankedGrowth,
    annual_return_percentage: jsonObject.totalBankedGrowth,
    max_drawdown_percentage: jsonObject.deepestValleyPercent,
    profit_factor: jsonObject.bankedProfitFactor,
  });

  await strategyService.updateStrategyByName("Dynamic",{
    monthly_return_percentage: (jsonObject.monthlyBankedGrowth)*2,
    annual_return_percentage: (jsonObject.totalBankedGrowth)*2,
    max_drawdown_percentage: (jsonObject.deepestValleyPercent)*2,
    profit_factor: jsonObject.bankedProfitFactor,
  });
  
  res.send({"success":true, code:201 , "message":"Fxblue Data fetch Successfully", "data":jsonObject});
});





module.exports = {
  createMtAccount,
  getMtAccountById,
  getMtAccount,
  updateMtAccount,
  deleteMtAccount,
  createMtBroker,
  getMtBroker,
  getMtBrokerById,
  updateMtBroker,
  deleteMtBroker,
  getServerData,
  FxblueScript,
};
