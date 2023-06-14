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
const logger = require('./config/logger');
mt4Socket.connect(config.mt4Server.SocketUrl + 'OnOrderUpdate?id=' + config.mt4Server.Mt4MasterToken);
const { emitData } = require('./socket');
const generateNotification = require('./middlewares/common');

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
            await masterTradingOrder.updateTradeOrder(order, 'closeOrder');
          } else {
            await masterTradingOrder.createMasterTradingOrder(order, 'orderSend');
          }
          const connectedUsers = await userExchangeConfig.getConnectedUser();
          // Create an array of promises for sending order data to each user
          const sendOrderPromises = connectedUsers.map((user) => {
            return new Promise(async (resolve, reject) => {
              try {
                const checkConnection = await mt4Server.checkConnection(user.serverToken);
                console.log(checkConnection, '-----------------checkConnection');
                let BrokerToken;
                if (checkConnection?.message) {
                  const maxAttempts = 3;
                  let currentAttempt = 0;
                  const ipList = await mt4Server.getServerDataForIps(user.config.server);
                  for (const ip of ipList) {
                    let IP;
                    let PORT;
                    const [address, port] = ip.split(':');
                    logger.info(`Trying IP: ${ip}`);
                    if (port) {
                      IP = address;
                      PORT = port;
                    } else {
                      IP = ip;
                      PORT = '443';
                    }
                    const response = await mt4Server.connect(user, IP, PORT);
                    console.log(response, '--------------------responseresponse');
                    await userExchangeConfig.updateServerTokenById(user.id, response);
                    BrokerToken = response;
                    currentAttempt++;
                    if (currentAttempt === maxAttempts) {
                      logger.warn('MT4 server connection reached maximum attempts limit');
                      break; // Exit the loop if maximum attempts reached
                    }
                  }
                } else {
                  BrokerToken = user.serverToken;
                  console.log(`Order sent to user: ${user}`);
                  const tradingData = await tradingOrder.checkMasterTradingId(order.Ticket, user.userId);
                  if (tradingData) {
                    const closeData = await mt4Server.orderClose(user.BrokerToken, tradingData.ticketId, tradingData.lots);
                    const updatedData = await tradingOrder.updateTradeOrderByMasterTicket(
                      order.Ticket,
                      closeData,
                      'closeOrder'
                    );
                    await generateNotification({
                      title: `Ticket Id  ${updatedData.ticketId} order closed successfully`,
                      message: `The order for ${updatedData.lots} lots has been successfully closed.`,
                    },updatedData.userId);
                    console.log(updatedData, '###########################');
                    emitData('MT4TradeUpdated', updatedData);
                  } else {
                    const userLots = await handleSlaveStrategies(user, masterBalance, order.Lots, BrokerToken);
                    if (userLots.lots) {
                      const tradeData = await mt4Server.orderSend(order, BrokerToken, userLots.lots);
                      console.log(tradeData, '---------------------------tradeData');
                      const createdTradeOrder = await tradingOrder.createTradingOrder(
                        tradeData,
                        user.userId,
                        order,
                        'orderSend'
                      );
                      await generateNotification({
                        title: `Order sent  successfully`,
                        message: `The order for ${createdTradeOrder.lots} items has been successfully sent.`,
                      },createdTradeOrder.userId);
                      emitData('MT4TradeUpdated', createdTradeOrder);
                      //console.log(`Order sent to user: ${user}`);
                      // Additional logic to send the order data to the user
                      resolve();
                    }
                  }
                }
              } catch (error) {
                reject(error);
              }
            });
          });
          // Wait for all promises to resolve
          await Promise.all(sendOrderPromises);
        }
      }
    });
  });
};

const handleSlaveStrategies = async (user, masterBalance, lots, serverToken) => {
  const configData = await globalConfig.getGlobalConfig();
  const strategy = await userStrategyService.getStrategyByUserId(user.userId);
  const strategyName = strategy.strategyId.name;
  if (strategyName) {
    const userBalance = await mt4Server.accountSummary(serverToken);
    console.log(userBalance, '---------------------------userBalance');
    let finalLots;
    const priceRatio = masterBalance / userBalance.balance;
    if (strategyName === 'Conservative' && userBalance.balance > configData.conservative_min_amount) {
      const volume = lots / priceRatio / configData.conservative_check_amount;
      finalLots = volume > configData.lots_min_amount ? volume : configData.lots_min_amount;
    }
    if (strategyName === 'Balanced' && userBalance.balance > configData.balanced_min_amount) {
      finalLots = lots;
    }
    if (strategyName === 'Dynamic' && userBalance.balance > configData.dynamic_min_amount) {
      const volume = lots / priceRatio / configData.dynamic_check_amount;
      finalLots = volume > configData.lots_min_amount ? volume : configData.lots_min_amount;
    }
    console.log(finalLots);
    return { lots: finalLots };
  } else {
    return { error: 'Data not found' };
  }
};

module.exports = {
  mtSocket,
};