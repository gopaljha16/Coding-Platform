const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

let io;

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Socket.IO middleware for authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: Token missing'));
      }
      
      // Verify JWT token
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const { _id } = payload;
      
      if (!_id) {
        return next(new Error('Authentication error: Invalid token payload'));
      }
      
      // Find user in database
      const user = await User.findById(_id);
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }
      
      // Attach user to socket
      socket.user = user;
      next();
    } catch (error) {
      return next(new Error('Authentication error: ' + error.message));
    }
  });

  // Socket.IO connection handler
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.name} (${socket.id})`);
    
    // Join discussion room
    socket.on('join-discussion', (discussionId) => {
      socket.join(`discussion:${discussionId}`);
      console.log(`${socket.user.name} joined discussion: ${discussionId}`);
    });
    
    // Leave discussion room
    socket.on('leave-discussion', (discussionId) => {
      socket.leave(`discussion:${discussionId}`);
      console.log(`${socket.user.name} left discussion: ${discussionId}`);
      
      // Emit stop typing when leaving discussion
      io.to(`discussion:${discussionId}`).emit('user-stop-typing', {
        discussionId,
        userId: socket.user._id
      });
    });
    
    // Handle typing indicator
    socket.on('typing', ({ discussionId, user }) => {
      io.to(`discussion:${discussionId}`).emit('user-typing', {
        discussionId,
        user: {
          _id: socket.user._id,
          name: socket.user.name
        }
      });
    });
    
    // Handle stop typing indicator
    socket.on('stop-typing', ({ discussionId }) => {
      io.to(`discussion:${discussionId}`).emit('user-stop-typing', {
        discussionId,
        userId: socket.user._id
      });
    });
    
    // Disconnect handler
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.name} (${socket.id})`);
      
      // Clean up any active typing indicators when user disconnects
      socket.rooms.forEach(room => {
        if (room.startsWith('discussion:')) {
          const discussionId = room.split(':')[1];
          io.to(room).emit('user-stop-typing', {
            discussionId,
            userId: socket.user._id
          });
        }
      });
    });
  });

  return io;
};

// Get the Socket.IO instance
const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

module.exports = {
  initializeSocket,
  getIO
};