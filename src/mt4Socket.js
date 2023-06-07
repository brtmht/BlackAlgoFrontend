const WebSocketClient = require('websocket').client;
const mt4Socket = new WebSocketClient();
const config = require('./config/config');
const masterTradingOrder = require('./services/masterTradingOrder.service');
const userExchangeConfig = require('./services/userExchangeConfig.service');
const tradingOrder = require('./services/tradingOrder.service');
const userStrategyService = require('./services/userStrategy.service');
const globalConfig = require('./services/globalConfig.service');
const mt4Server = require('./middlewares/mt4Server');
const ApiError = require('./utils/ApiError');
mt4Socket.connect(config.mt4Server.SocketUrl + 'OnOrderUpdate?id=' + config.mt4Server.Mt4MasterToken);

const mtSocket = () => {
  mt4Socket.on('connectFailed', function (error) {
    console.log('Connect Error: ' + error.toString());
  });

  mt4Socket.on('connect', function (connection) {
    console.log('Mt4 Connection established!');

    connection.on('error', function (error) {
      console.log('Connection error: ' + error.toString());
    });

    connection.on('close', function () {
      console.log('MT4 Connection closed!');
    });

    connection.on('message', async function (message) {
      const ordersData = JSON.parse(message.utf8Data);
      if (config.mt4Server.Mt4MasterToken === ordersData.Id) {
        const order = ordersData?.Data?.Update?.Order;
        const masterBalance = ordersData?.Data?.Balance;
        if (order) {
          const masterAccount = await masterTradingOrder.checkTradingId(order.Ticket);
          if (masterAccount) {
            if(masterAccount.lots > order.Lots){
              await tradingOrder.createTradingOrder(order,"closeOrder");
            }else{
              const totalLots = masterAccount.lots - order.Lots;
              await masterTradingOrder.updateTradeOrder(masterAccount.ticketId, totalLots);
            }
          } else {
            await masterTradingOrder.createMasterTradingOrder(order,"orderSend");
          }

          // const connectedUsers = await userExchangeConfig.getConnectedUser();
          // // Create an array of promises for sending order data to each user
          // const sendOrderPromises = connectedUsers.map((user) => {
          //   return new Promise(async (resolve, reject) => {
          //     try {
          //       const tradingData = await tradingOrder.checkMasterTradingId(order.Ticket, user.userId);
          //       if (tradingData) {
          //         const slaveSellLots = (tradingData.lots / masterAccount.Lots) * order.Lots;
          //         const closeData = await mt4Server.orderClose(
          //           user.serverToken,
          //           tradingData.ticketId,
          //           slaveSellLots.toFixed(2)
          //         );
          //         if(tradingData.lots > slaveSellLots){

          //           await tradingOrder.createTradingOrder(order,user.userId, closeData, "closeOrder");
          //         }else{
          //           const totalLots = tradingData.lots - slaveSellLots;
          //           await tradingOrder.updateTradeOrderLots(tradingData.ticketId, totalLots);
          //         }
                  
          //       } else {
          //         const userLots = await handleSlaveStrategies(user, masterBalance, order.Lots);
          //         if (userLots.lots) {
          //           const tradeData = await mt4Server.orderSend(order, user, userLots.lots);
          //           await tradingOrder.createTradingOrder(tradeData, user.userId, order, "orderSend");
          //           //console.log(`Order sent to user: ${user}`);
          //           // Additional logic to send the order data to the user
          //           resolve();
          //         }
          //       }
          //     } catch (error) {
          //       reject(error);
          //     }
          //   });
          // });
          // // Wait for all promises to resolve
          // await Promise.all(sendOrderPromises);
        }
      }
    });
  });
};

const handleSlaveStrategies = async (user, masterBalance, lots) => {
  const configData = await globalConfig.getGlobalConfig();
  const strategy = await userStrategyService.getStrategyByUserId(user.userId);
  const strategyName = strategy.strategyId.name;
  if (strategyName) {
    const userBalance = await mt4Server.accountSummary(user.serverToken);
    let finalLots;
    const priceRatio = masterBalance / userBalance.balance;
    if (strategyName === 'conservative' && userBalance.balance > configData.conservative_min_amount) {
      const volume = lots / priceRatio / configData.conservative_check_amount;
      finalLots = volume > configData.lots_min_amount ? volume : configData.lots_min_amount;
    }
    if (strategyName === 'balanced' && userBalance.balance > configData.balanced_min_amount) {
      finalLots = lots;
    }
    if (strategyName === 'dynamic' && userBalance.balance > configData.dynamic_min_amount) {
      const volume = lots / priceRatio / configData.dynamic_check_amount;
      finalLots = volume > configData.lots_min_amount ? volume : configData.lots_min_amount;
    }
    return { lots: finalLots };
  } else {
    return { error: 'Data not found' };
  }
};

module.exports = {
  mtSocket,
};
