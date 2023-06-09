const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const http = require('http');
const server = http.createServer(app);
const initializeSocket = require('./socket');
const { mtSocket } = require('./mt4Socket');

mongoose.set('strictQuery', false);
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
});

mtSocket();


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
// Initialize Socket.io server
initializeSocket(server);
