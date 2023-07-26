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
const { generateNotification } = require('./middlewares/common');
const { exchangeService } = require('./services');

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
        const orderType = ordersData?.Data?.Update?.Action;
        const masterBalance = ordersData?.Data?.Balance;

        if (order) {
          switch (orderType) {
            case "PositionOpen":
              masterTradingOrder.createMasterTradingOrder(order, 'orderSend',masterBalance).catch(logger.error);
              break;

            case "PositionModify":
              masterTradingOrder.updateTradeOrder(order, 'orderModify').catch(logger.error);
              break;

            case "PositionClose":
              masterTradingOrder.updateTradeOrder(order, 'orderClose').catch(logger.error);
              break;
          
            default:
              break;
          }

          const connectedUsers = await userExchangeConfig.getConnectedAccountUser();
          // Create an array of promises for sending order data to each user
          const sendOrderPromises = connectedUsers.map((user) => {
            return new Promise(async (resolve, reject) => {
              try {
                const exchangeData = await exchangeService.getExchangeById(user.exchangeId);
                let BrokerToken;
                // BrokerToken = user.serverToken;
                const checkConnection = await mt4Server.checkConnection(user.serverToken);
                let connectionAttempts = 0;

                if (checkConnection?.message) {
                  const maxAttempts = 3;
                  const ipList = await mt4Server.getServerDataForIps(user.config.server);

                  for (const ip of ipList) {
                    if (connectionAttempts >= maxAttempts) {
                      logger.warn('action: MT4 server connection reached maximum attempts limit');
                      break;
                    }

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
                    console.log("action: new mt4 token generated");
                    if (!response.message) {
                      await userExchangeConfig.updateServerTokenById(user.id, response);
                      BrokerToken = response;
                      break;
                    } else {
                      connectionAttempts++;
                    }
                  }
                } else {
                  BrokerToken = user.serverToken;
                }

                console.log(`Order Type: ${orderType}, Order Details: { Ticket: ${order.Ticket }, Lots: ${order.Lots } }`);
                const tradingData = await tradingOrder.checkMasterTradingId(order.Ticket, user.userId);
                switch (orderType) {
                  case "PositionOpen":
                    const userLots = await handleSlaveStrategies(user, masterBalance, order.Lots, BrokerToken);
                    if (userLots.lots) {
                      console.log(userLots.lots, "userLots.lots");
                      const tradeData = await mt4Server.orderSend(order, BrokerToken, userLots.lots, exchangeData.name);

                      if (!tradeData.message) {

                        console.log('created broker order');
                        const createdTradeOrder = await tradingOrder.createTradingOrder(
                          tradeData,
                          user.userId,
                          order,
                          'orderSend',
                          userLots.walletAmount,
                        );
                        console.log('created broker order data store in DB');
                        await generateNotification({
                          title: `Order sent  successfully`,
                          message: `The order for ${createdTradeOrder.lots} items has been successfully sent.`,
                        }, createdTradeOrder.userId);
                        emitData('MT4TradeUpdated', { success: true, code: 201, message: 'Order created Successfully', data: createdTradeOrder });
                      }

                      // Additional logic to send the order data to the user
                      resolve();
                    }
                    break;
      
                  case "PositionModify":
                    const tradeData = await mt4Server.orderModify(order, BrokerToken, tradingData.ticketId);
                    if (!tradeData.message) {
                      updatedData = await tradingOrder.updateTradeOrderByMasterTicket(
                        order.Ticket,
                        tradeData,
                        'orderModify'
                      );
                    }
                    break;
      
                  case "PositionClose":
                    let closeData = { mesaage: '' }
                    try {
                      closeData = await mt4Server.orderClose(BrokerToken, tradingData.ticketId, tradingData.lots);
                    } catch (error) {
                      closeData.message = error
                      console.log(error, "Auto closing oder on position close")                      
                    }
                    console.log("PositionClose mt4Server.orderClose ->", closeData.message);
                    if (!closeData.message) {
                      console.log("action: broker order close Data");
                      updatedData = await tradingOrder.updateTradeOrderByMasterTicket(
                        order.Ticket,
                        closeData,
                        'closeOrder'
                      );

                      await generateNotification({
                        title: `Ticket Id  ${updatedData.ticketId} order closed successfully`,
                        message: `The order for ${updatedData.lots} lots has been successfully closed.`,
                      }, updatedData.userId);
                      emitData('MT4TradeUpdated', { success: true, code: 201, message: 'Order closed Successfully', data: updatedData });
                    } else {
                      updatedData = await tradingOrder.updateTradeOrderType(
                        order.Ticket,
                        user.userId,
                        'closeOrder'
                      );
                    }
                    break;              
                  default:
                    break;
                }
              } catch (error) {
                reject(error);
              }
            });
          });
          // Wait for all promises to resolve
          await Promise.all(sendOrderPromises).catch(err => {
            console.log("Error in Promise.all", err);
            logger.error(err)
          });
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
    console.log('get userBalance');
    let finalLots;
    const priceRatio = masterBalance / userBalance.balance;
    if (strategyName === 'Conservative' && userBalance.balance > configData.conservative_min_amount) {
      console.log(lots / priceRatio / configData.conservative_check_amount,"--------CONSERVATIVE---------",lots,priceRatio,configData.conservative_check_amount);
      const volume = lots / priceRatio / configData.conservative_check_amount;
      finalLots = volume > configData.lots_min_amount ? volume : configData.lots_min_amount;
    }
    if (strategyName === 'Balanced' && userBalance.balance > configData.balanced_min_amount) {
      console.log(lots,"---------------BALANCED--------");
      finalLots = lots;
    }
    if (strategyName === 'Dynamic' && userBalance.balance > configData.dynamic_min_amount) {
      console.log(lots / priceRatio * configData.dynamic_check_amount,"-------DYNAMIC---------",lots,priceRatio, configData.dynamic_check_amount);
      const volume = lots / priceRatio * configData.dynamic_check_amount;
      finalLots = volume > configData.lots_min_amount ? volume : configData.lots_min_amount;
    }

    return { lots: finalLots, walletAmount: userBalance.balance };
  } else {
    return { error: 'Data not found' };
  }
};

module.exports = {
  mtSocket,
};