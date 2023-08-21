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
const { exchangeService, binanceService } = require('./services');

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
        console.log(order, 'Mt4 master order');
        if (order) {
          switch (orderType) {
            case 'PositionOpen':
              masterTradingOrder.createMasterTradingOrder(order, 'orderSend', masterBalance).catch(logger.error);
              break;

            case 'PositionModify':
              masterTradingOrder.updateTradeOrder(order, 'orderModify').catch(logger.error);
              break;

            case 'PositionClose':
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

                if (exchangeData.name === 'Binance Global') {
                  const tradingData = await tradingOrder.checkMasterTradingId(order.Ticket, user.userId);
                  switch (orderType) {
                    case 'PositionOpen':
                      const binanceLots = await handleBinanceSlaveStrategies(user, masterBalance, order.Lots);
                      if (binanceLots.lots) {
                        console.log(binanceLots.lots, 'binanceLots.lots');
                        const orderCreated = await binanceService.CreateSimpleBinanceTradeOrder(
                          user,
                          order,
                          binanceLots.lots,
                          exchangeData.name
                        );
                        if (orderCreated) {
                          const orderQuery = await binanceService.getBinanceOrder(user.config, orderCreated);
                          console.log(orderQuery, 'CreateorderQuery');
                          if (orderQuery) {
                            const createdTradeOrder = await tradingOrder.createBinanceTradingOrder(
                              orderQuery,
                              user.userId,
                              order,
                              'orderSend',
                              binanceLots.walletAmount
                            );
                            console.log('created Binannce broker order data store in DB');
                            await generateNotification(
                              {
                                title: `Order sent  successfully`,
                                message: `The order for ${createdTradeOrder.lots} items has been successfully sent.`,
                              },
                              createdTradeOrder.userId
                            );
                            emitData('MT4TradeUpdated', {
                              success: true,
                              code: 201,
                              message: 'Order created Successfully',
                              data: createdTradeOrder,
                            });
                          }
                        }
                        // if (binanceLots.lots && order.StopLoss !== 0) {
                        //   console.log(binanceLots.lots, 'binanceLots.lots');
                        //   const stopLossOrderCreated = await binanceService.CreateBinanceTradeOrderUsingStopLoss(
                        //     user,
                        //     order,
                        //     binanceLots.lots,
                        //     exchangeData.name
                        //   );
                        //   console.log(stopLossOrderCreated, '-----------------order stop loss Created');
                        //   if (stopLossOrderCreated) {
                        //     const orderQuery = await binanceService.getBinanceOrder(user.config, stopLossOrderCreated);
                        //     console.log(orderQuery, '----------------------orderQuery');
                        //   }
                        // }
                        // if (binanceLots.lots && order.TakeProfit !== 0) {
                        //   console.log(binanceLots.lots, 'binanceLots.lots');
                        //   const takeProfitOrderCreated = await binanceService.CreateBinanceTradeOrderUsingTakeProfit(
                        //     user,
                        //     order,
                        //     binanceLots.lots,
                        //     exchangeData.name
                        //   );
                        //   console.log(takeProfitOrderCreated, '-----------------order Take Profit Created');
                        //   if (takeProfitOrderCreated) {
                        //     const orderQuery = await binanceService.getBinanceOrder(user.config, takeProfitOrderCreated);
                        //     console.log(orderQuery, '----------------------orderQuery');
                        //   }
                        // }
                        resolve();
                      }
                      break;
                    case 'PositionModify':
                      console.log('Not Modified Binance Order  PositionModify');
                      break;
                    case 'PositionClose':
                      const orderClosed = await binanceService.CloseBinanceTradeOrder(
                        user,
                        order,
                        order.Lots,
                        exchangeData.name
                      );
                      console.log(orderClosed, 'orderClosed');
                      if (orderClosed) {
                        const orderQuery = await binanceService.getBinanceOrder(user.config, orderClosed);
                        console.log(orderQuery, 'ClosedorderQuery');
                        if (orderQuery) {
                          const updatedData = await tradingOrder.updateCloseBinanceTradingOrder(
                            order.Ticket,
                            user.userId,
                            orderQuery,
                            'closeOrder'
                          );
                          console.log(updatedData, 'closeTradeOrder');
                          await generateNotification(
                            {
                              title: `Ticket Id  ${updatedData.ticketId} order closed successfully`,
                              message: `The order for ${updatedData.lots} lots has been successfully closed.`,
                            },
                            updatedData.userId
                          );
                          emitData('MT4TradeUpdated', {
                            success: true,
                            code: 201,
                            message: 'Order closed Successfully',
                            data: updatedData,
                          });
                        }
                      }
                      break;
                    default:
                      break;
                  }
                } else {
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
                      console.log('action: new mt4 token generated');
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
                  console.log(`Order Type: ${orderType}, Order Details: { Ticket: ${order.Ticket}, Lots: ${order.Lots} }`);
                  const tradingDataArray = await tradingOrder.checkMasterTradingId(order.Ticket, user.userId);
                  switch (orderType) {
                    case 'PositionOpen':
                      // const userLots = await handleSlaveStrategies(user, masterBalance, order.Lots, BrokerToken);
                      // if (userLots.lots) {
                      //   console.log(userLots.lots, 'userLots.lots');
                      //   const tradeData = await mt4Server.orderSend(order, BrokerToken, userLots.lots, exchangeData.name);

                      //   if (!tradeData.message) {
                      //     console.log('created broker order');
                      //     const createdTradeOrder = await tradingOrder.createTradingOrder(
                      //       tradeData,
                      //       user.userId,
                      //       order,
                      //       'orderSend',
                      //       userLots.walletAmount
                      //     );
                      //     console.log('created broker order data store in DB');
                      //     await generateNotification(
                      //       {
                      //         title: `Order sent  successfully`,
                      //         message: `The order for ${createdTradeOrder.lots} items has been successfully sent.`,
                      //       },
                      //       createdTradeOrder.userId
                      //     );
                      //     emitData('MT4TradeUpdated', {
                      //       success: true,
                      //       code: 201,
                      //       message: 'Order created Successfully',
                      //       data: createdTradeOrder,
                      //     });
                      //   }

                      //   // Additional logic to send the order data to the user
                      //   resolve();
                      // }
                      const userLots = await handleSlaveStrategies(user, masterBalance, order.Lots, BrokerToken);

                      if (userLots.lots) {
                        console.log(userLots.lots, 'userLots.lots');

                        const numberOfOrders = Math.ceil(userLots.lots / 10); // Calculate the number of orders
                        const promises = [];

                        for (let i = 0; i < numberOfOrders; i++) {
                          const lotsToSend = i === numberOfOrders - 1 ? userLots.lots % 10 || 10 : 10;

                          // Push the promise of sending each order into the array
                          promises.push(mt4Server.orderSend(order, BrokerToken, lotsToSend, exchangeData.name));
                        }

                        try {
                          // Use Promise.all to send all orders concurrently
                          const tradeDataArray = await Promise.all(promises);

                          for (const tradeData of tradeDataArray) {
                            if (!tradeData.message) {
                              console.log('created broker order');
                              const createdTradeOrder = await tradingOrder.createTradingOrder(
                                tradeData,
                                user.userId,
                                order,
                                'orderSend',
                                userLots.walletAmount
                              );
                              console.log('created broker order data store in DB');
                              await generateNotification(
                                {
                                  title: `Order sent successfully`,
                                  message: `The order for ${createdTradeOrder.lots} items has been successfully sent.`,
                                },
                                createdTradeOrder.userId
                              );
                              emitData('MT4TradeUpdated', {
                                success: true,
                                code: 201,
                                message: 'Order created Successfully',
                                data: createdTradeOrder,
                              });
                            }
                          }

                          // Additional logic to send the order data to the user
                          resolve();
                        } catch (error) {
                          console.error('Error sending orders:', error);
                          // Handle errors here if needed
                        }
                      }
                      break;

                    case 'PositionModify':
                      // const tradeData = await mt4Server.orderModify(order, BrokerToken, tradingData.ticketId);
                      // if (!tradeData.message) {
                      //   updatedData = await tradingOrder.updateTradeOrderByMasterTicket(
                      //     order.Ticket,
                      //     tradeData,
                      //     'orderModify'
                      //   );
                      // }
                      const modifyPromises = tradingDataArray.map(async (tradingData) => {
                        const tradeData = await mt4Server.orderModify(order, BrokerToken, tradingData.ticketId);

                        if (!tradeData.message) {
                          return tradingOrder.updateTradeOrderByMasterTicket(tradingData.ticketId, tradeData, 'orderModify');
                        } else {
                          return null; // Return null if modification failed
                        }
                      });

                      const modifyResults = await Promise.all(modifyPromises);

                      const successfulModifyResults = modifyResults.filter((result) => result !== null);

                      console.log(successfulModifyResults, 'modified order successfulResults');

                      break;
                    case 'PositionClose':
                      // let closeData = { mesaage: '' };
                      // try {
                      //   closeData = await mt4Server.orderClose(BrokerToken, tradingData.ticketId, tradingData.lots);
                      // } catch (error) {
                      //   closeData.message = error;
                      //   console.log(error, 'Auto closing oder on position close');
                      // }
                      // console.log('PositionClose mt4Server.orderClose ->', closeData.message);
                      // if (!closeData.message) {
                      //   console.log('action: broker order close Data');
                      //   updatedData = await tradingOrder.updateTradeOrderByMasterTicket(
                      //     order.Ticket,
                      //     closeData,
                      //     'closeOrder'
                      //   );

                      //   await generateNotification(
                      //     {
                      //       title: `Ticket Id  ${updatedData.ticketId} order closed successfully`,
                      //       message: `The order for ${updatedData.lots} lots has been successfully closed.`,
                      //     },
                      //     updatedData.userId
                      //   );
                      //   emitData('MT4TradeUpdated', {
                      //     success: true,
                      //     code: 201,
                      //     message: 'Order closed Successfully',
                      //     data: updatedData,
                      //   });
                      // } else {
                      //   updatedData = await tradingOrder.updateTradeOrderType(order.Ticket, user.userId, 'closeOrder');
                      // }
                      const closePromises = tradingDataArray.map(async (tradingData) => {
                        try {
                          const closeData = await mt4Server.orderClose(BrokerToken, tradingData.ticketId, tradingData.lots);

                          if (!closeData.message) {
                            console.log('action: broker order close Data');
                            const updatedData = await tradingOrder.updateTradeOrderByMasterTicket(
                              tradingData.ticketId,
                              closeData,
                              'closeOrder'
                            );

                            await generateNotification(
                              {
                                title: `Ticket Id  ${updatedData.ticketId} order closed successfully`,
                                message: `The order for ${updatedData.lots} lots has been successfully closed.`,
                              },
                              updatedData.userId
                            );
                            emitData('MT4TradeUpdated', {
                              success: true,
                              code: 201,
                              message: 'Order closed Successfully',
                              data: updatedData,
                            });
                          } else {
                            await tradingOrder.updateTradeOrderType(tradingData.Ticket, user.userId, 'closeOrder');
                          }
                        } catch (error) {
                          console.log(error, 'Auto closing order on position close');
                        }
                      });

                      const closeResults = await Promise.all(closePromises);
                      const successfulResults = closeResults.filter((result) => result !== null);

                      console.log(successfulResults, 'close order successfulResults');

                      break;
                    default:
                      break;
                  }
                }
              } catch (error) {
                reject(error);
              }
            });
          });
          // Wait for all promises to resolve
          await Promise.all(sendOrderPromises).catch((err) => {
            console.log('Error in Promise.all', err);
            logger.error(err);
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
      console.log(
        lots / priceRatio / configData.conservative_check_amount,
        '--------CONSERVATIVE---------',
        lots,
        priceRatio,
        configData.conservative_check_amount
      );
      const volume = lots / priceRatio / configData.conservative_check_amount;
      finalLots = volume > configData.lots_min_amount ? volume : configData.lots_min_amount;
    }
    if (strategyName === 'Balanced' && userBalance.balance > configData.balanced_min_amount) {
      console.log(lots, '---------------BALANCED--------', lots / priceRatio);
      finalLots = lots / priceRatio;
    }
    if (strategyName === 'Dynamic' && userBalance.balance > configData.dynamic_min_amount) {
      console.log(
        (lots / priceRatio) * configData.dynamic_check_amount,
        '-------DYNAMIC---------',
        lots,
        priceRatio,
        configData.dynamic_check_amount
      );
      const volume = (lots / priceRatio) * configData.dynamic_check_amount;
      finalLots = volume > configData.lots_min_amount ? volume : configData.lots_min_amount;
    }

    return { lots: finalLots, walletAmount: userBalance.balance };
  } else {
    return { error: 'Data not found' };
  }
};

const handleBinanceSlaveStrategies = async (user, masterBalance, lots) => {
  const configData = await globalConfig.getGlobalConfig();
  const strategy = await userStrategyService.getStrategyByUserId(user.userId);
  const strategyName = strategy.strategyId.name;
  if (strategyName) {
    const userBalance = await binanceService.GetBinanceBalance(user.config);
    console.log('get userBalance', userBalance);
    let finalLots;
    const priceRatio = masterBalance / userBalance.balance;
    if (strategyName === 'Conservative' && userBalance.balance > configData.conservative_min_amount) {
      console.log(
        lots / priceRatio / configData.conservative_check_amount,
        '--------CONSERVATIVE---------',
        lots,
        priceRatio,
        configData.conservative_check_amount
      );
      const volume = lots / priceRatio / configData.conservative_check_amount;
      finalLots = volume > configData.lots_min_amount ? volume : configData.lots_min_amount;
    }
    if (strategyName === 'Balanced' && userBalance.balance > configData.balanced_min_amount) {
      console.log(lots, '---------------BALANCED--------', lots / priceRatio);
      finalLots = lots / priceRatio;
    }
    if (strategyName === 'Dynamic' && userBalance.balance > configData.dynamic_min_amount) {
      console.log(
        (lots / priceRatio) * configData.dynamic_check_amount,
        '-------DYNAMIC---------',
        lots,
        priceRatio,
        configData.dynamic_check_amount
      );
      const volume = (lots / priceRatio) * configData.dynamic_check_amount;
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
