const catchAsync = require('../utils/catchAsync');
const { strategyService } = require('../services');
const mt4Server = require('../middlewares/mt4Server');

const getServerData = catchAsync(async (req, res) => {
  const serverData = await mt4Server.getServerData(req.body.serverName);
  res.send({ success: true, code: 201, message: 'Get broker server list Successfully', data: serverData });
});

const FxblueScript = catchAsync(async (req, res) => {
  const response = await mt4Server.fxblueScript();
  const jsonStart = response.indexOf('{');
  const jsonEnd = response.lastIndexOf('}');
  const jsonContent = response.substring(jsonStart, jsonEnd + 1);
  const jsonObject = eval('(' + jsonContent + ')');
  await strategyService.updateStrategyByName('Conservative', {
    monthly_return_percentage: (jsonObject.monthlyBankedGrowth / 2).toFixed(2),
    annual_return_percentage: (jsonObject.totalBankedGrowth / 2).toFixed(2),
    max_drawdown_percentage: (jsonObject.deepestValleyPercent / 2).toFixed(2),
    profit_factor: jsonObject.bankedProfitFactor.toFixed(2),
  });

  await strategyService.updateStrategyByName('Balanced', {
    monthly_return_percentage: jsonObject.monthlyBankedGrowth.toFixed(2),
    annual_return_percentage: jsonObject.totalBankedGrowth.toFixed(2),
    max_drawdown_percentage: jsonObject.deepestValleyPercent.toFixed(2),
    profit_factor: jsonObject.bankedProfitFactor.toFixed(2),
  });

  await strategyService.updateStrategyByName('Dynamic', {
    monthly_return_percentage: (jsonObject.monthlyBankedGrowth * 2).toFixed(2),
    annual_return_percentage: (jsonObject.totalBankedGrowth * 2).toFixed(2),
    max_drawdown_percentage: (jsonObject.deepestValleyPercent * 2).toFixed(2),
    profit_factor: jsonObject.bankedProfitFactor.toFixed(2),
  });

  res.send({ success: true, code: 201, message: 'Fxblue Data fetch Successfully', data: jsonObject });
});

module.exports = {
  getServerData,
  FxblueScript,
};
