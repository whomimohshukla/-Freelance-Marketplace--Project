const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let ioInstance = null;

function getIO() {
  if (!ioInstance) throw new Error('Socket.io not initialized');
  return ioInstance;
}

function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:5173',
      credentials: true,
    },
  });
  ioInstance = io;

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace('Bearer ', '');
      if (!token) return next(new Error('Authentication required'));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = { id: decoded.userId, role: decoded.role };
      return next();
    } catch (e) {
      return next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userRoom = String(socket.user.id);
    socket.join(userRoom);

    socket.on('message:send', (payload) => {
      // Expect backend REST to be primary for persistence.
      // This handler can be used for optimistic updates if desired.
      io.to(String(payload.receiver)).emit('message:new', payload);
    });

    socket.on('message:read', ({ messageId, sender }) => {
      if (sender) io.to(String(sender)).emit('message:read', { messageId });
    });

    socket.on('disconnect', () => {
      socket.leave(userRoom);
    });
  });

  return io;
}

module.exports = { initSocket, getIO };
