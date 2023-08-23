const { Server } = require('socket.io');
const pingInterval = 9 * 1000;

let io; // Declare io variable

module.exports = function (server) {
  io = new Server(server, {
    pingInterval: pingInterval,
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket) => {
    console.log(`socket Io Connected: ${socket.id}`)

    function sendPing() {
      console.log("Sending ping");
      socket.emit('ping');
    }

    setTimeout(sendPing, pingInterval);

    socket.on('disconnect', (reason) => {
      console.log(`socket Io Disconnected: ${socket.id} due to ${reason}`);
    });

    socket.on('pong', function(data) {
      setTimeout(sendPing, pingInterval);
      console.log('pong');
    });
  });

  return io;
};

// Function to emit data from other files
module.exports.emitData = (event, data) => {
    console.log(event, data)
    io.emit(event, data);
  };
