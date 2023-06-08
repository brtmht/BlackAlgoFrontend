const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const { Server } = require("socket.io");
const http = require('http');
const server = http.createServer(app);
const {mtSocket} = require('./mt4Socket');

mongoose.set('strictQuery', false);
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
});

mtSocket();

const blackalgoIo = new Server(server,{
  cors: {
    origin: process.env.APP_URL, // Replace with your React app's URL
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  },
});

blackalgoIo.on("connection", (socket) => {
  console.log("Inside connection event");
  console.log(`Connected: ${socket.id}`);

  socket.on("disconnect", (reason) => {
    console.log(`Disconnected: ${socket.id} due to ${reason}`);
  });

  // Handle 'MT4TradeUpdated' event
  socket.on('MT4TradeUpdated', (data) => {
    console.log(data,"==================================");
    // Broadcast the updated record to all connected clients
    io.emit('MT4TradeUpdated', data);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});

server.listen(config.port, () => {
  logger.info(`Listening on port ${config.port}`);
});
