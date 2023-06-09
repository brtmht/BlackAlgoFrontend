const { Server } = require('socket.io');

let io; // Declare io variable

module.exports = function (server) {
  io = new Server(server, {
    cors: {
      origin: process.env.APP_URL, // Replace with your React app's URL
      methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`socket Io Connected: ${socket.id}`);

    socket.on('disconnect', (reason) => {
      console.log(`socket Io Disconnected: ${socket.id} due to ${reason}`);
    });
  });

  return io;
};

// Function to emit data from other files
module.exports.emitData = (event, data) => {
    io.emit(event, data);
  };
