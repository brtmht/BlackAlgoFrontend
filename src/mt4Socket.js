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
const {generateNotification} = require('./middlewares/common');

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
        console.log(order,"-----------------------------order");
        if (order) {
          // console.log(order,"-----------------------------order");
          const masterAccount = await masterTradingOrder.checkTradingId(order.Ticket);
          if (masterAccount) {
            if((order.StopLoss > 0  || order.TakeProfit > 0 )  && (order.Comment !== '[sl]' && order.Comment !== '[tp]')){
              await masterTradingOrder.updateTradeOrder(order, 'Stop limit');
              console.log("action : modify master stop limit");
            }else if ((order.StopLoss > 0   || order.TakeProfit > 0 ) && (order.Comment !== '')) {
              await masterTradingOrder.updateTradeOrder(order, 'closeOrder');
              console.log("action : close master order using stop limit ");
            }else if (order.StopLoss === 0 &&  order.TakeProfit === 0) {
              await masterTradingOrder.updateTradeOrder(order, 'closeOrder');
              console.log("action : close master order by market price");
            }  
          } else {
            await masterTradingOrder.createMasterTradingOrder(order, 'orderSend');
            console.log("action : Created master order ");
          }
          const connectedUsers = await userExchangeConfig.getConnectedUser();
          // Create an array of promises for sending order data to each user
          const sendOrderPromises = connectedUsers.map((user) => {
            return new Promise(async (resolve, reject) => {
              try {
                console.log(`action: user: ${user}`);
                const checkConnection = await mt4Server.checkConnection(user.serverToken);
                console.log("action: Check Mt4 connection");
                let BrokerToken;
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
                      console.log(response,"-------------------------responsetoken");
                      await userExchangeConfig.updateServerTokenById(user.id, response);
                      BrokerToken = response;
                      console.log("updated broker server token in db");
                      break;
                    } else {
                      connectionAttempts++;
                    }
                  }
                } else {
                  BrokerToken = user.serverToken;
                }
                  //console.log(`action: Order sent to user: ${user}`);
                  console.log(`action: Order sent to user`);
                  const tradingData = await tradingOrder.checkMasterTradingId(order.Ticket, user.userId);
                  console.log("action: find broker trading data");
                  if (tradingData) {
                    let updatedData;
                    if ((order.StopLoss > 0 || order.TakeProfit > 0) && (order.Comment !== '[sl]' && order.Comment !== '[tp]')) {
                      console.log(order,"--------------------------------------qwertyuiop[");
                      const tradeData = await mt4Server.orderModify(order, BrokerToken, tradingData.ticketId);
                      if(!tradeData.message){
                        console.log(tradeData,"--------------------tradeData Broker");
                        updatedData = await tradingOrder.updateTradeOrderByMasterTicket(
                          order.Ticket,
                          tradeData,
                          'limit'
                        );
                        console.log("action: update broker order stop limit data store in db----------------------",updatedData);
                      }else{
                        console.log(tradeData.message);
                      }
                 
                   }
                    else if ((order.StopLoss > 0 || order.TakeProfit > 0) && (order.Comment !== '')) {
                      const checkOrder = await mt4Server.checkOpenOrder(BrokerToken, tradingData.ticketId);
                      console.log(checkOrder.data,"---------------------------closeData");
                      // console.log("action: using SL broker order close Data");
                      if(!checkOrder.data){
                        console.log("--------------------testing");
                        updatedData = await tradingOrder.updateTradeOrderComments(
                          order.Ticket,
                          user.userId,
                          'closeOrderUsingLimit'
                        );
                        console.log("action: close broker order using stop limit store in db----------------------",updatedData);
                      }
                    }else if ((order.StopLoss === 0 && order.TakeProfit === 0)) {
                      const closeData = await mt4Server.orderClose(BrokerToken, tradingData.ticketId);
                      if(!closeData.mesaage){
                        console.log("action: broker order close Data");
                        updatedData = await tradingOrder.updateTradeOrderByMasterTicket(
                          order.Ticket,
                          closeData,
                          'closeOrder'
                        );
                        console.log("action: broker update close order data store in db ----------------------");
                        await generateNotification({
                          title: `Ticket Id  ${updatedData.ticketId} order closed successfully`,
                          message: `The order for ${updatedData.lots} lots has been successfully closed.`,
                        },updatedData.userId);
                        emitData('MT4TradeUpdated', updatedData);
                      }else{
                        console.log(closeData.mesaage);
                      }
                     
                    }
                  } else {
                    const userLots = await handleSlaveStrategies(user, masterBalance, order.Lots, BrokerToken);
                    if (userLots.lots) {
                      console.log(userLots.lots,"-------------------------userLots.lots");
                      const tradeData = await mt4Server.orderSend(order, BrokerToken, userLots.lots);
                     
                      if(!tradeData.message){
                        console.log('created broker order',tradeData);
                        const createdTradeOrder = await tradingOrder.createTradingOrder(
                          tradeData,
                          user.userId,
                          order,
                          'orderSend'
                        );
                        console.log('created broker order data store in DB');
                        await generateNotification({
                          title: `Order sent  successfully`,
                          message: `The order for ${createdTradeOrder.lots} items has been successfully sent.`,
                        },createdTradeOrder.userId);
                        emitData('MT4TradeUpdated', createdTradeOrder);
                      }else{
                        console.log(tradeData.message);
                      }
                     
                      //console.log(`Order sent to user: ${user}`);
                      // Additional logic to send the order data to the user
                      resolve();
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
    console.log('get userBalance');
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