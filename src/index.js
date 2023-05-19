const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const { Server } = require("socket.io");
const http = require('http');
const server = http.createServer(app);

mongoose.set('strictQuery', false);
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
});

const io = new Server(server,{
  cors: {
    origin: "*", // Replace with your React app's URL
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  },
});

io.on("connection", (socket) => {
  console.log("Inside connection event");
  console.log(`Connected: ${socket.id}`);

  socket.on("disconnect", (reason) => {
    console.log(`Disconnected: ${socket.id} due to ${reason}`);
  });

  // Handle custom events here
  socket.on('testEvent', (data) => {
    console.log('Received custom event:', data);
    // Perform any necessary actions and emit responses
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
