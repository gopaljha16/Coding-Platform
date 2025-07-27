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
      console.log('Socket auth token received:', token);
      
      if (!token) {
        console.log('Authentication error: Token missing');
        return next(new Error('Authentication error: Token missing'));
      }
      
      // Verify JWT token
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const { _id } = payload;
      
      if (!_id) {
        console.log('Authentication error: Invalid token payload');
        return next(new Error('Authentication error: Invalid token payload'));
      }
      
      // Find user in database
      const user = await User.findById(_id);
      if (!user) {
        console.log('Authentication error: User not found');
        return next(new Error('Authentication error: User not found'));
      }
      
      // Attach user to socket
      socket.user = user;
      next();
    } catch (error) {
      console.log('Authentication error:', error.message);
      
      // Provide more specific error messages for different JWT errors
      if (error instanceof jwt.TokenExpiredError) {
        return next(new Error('Authentication error: Token expired, please login again'));
      } else if (error instanceof jwt.JsonWebTokenError) {
        return next(new Error('Authentication error: Invalid token'));
      }
      
      return next(new Error('Authentication error: ' + error.message));
    }
  });

  // Socket.IO connection handler
  io.on('connection', (socket) => {
    const userName = `${socket.user.firstName} ${socket.user.lastName || ''}`.trim();
    console.log(`User connected: ${userName} (${socket.id})`);
    
    // Join discussion room
    socket.on('join-discussion', (discussionId) => {
      socket.join(`discussion:${discussionId}`);
      console.log(`${userName} joined discussion: ${discussionId}`);
    });
    
    // Leave discussion room
    socket.on('leave-discussion', (discussionId) => {
      socket.leave(`discussion:${discussionId}`);
      console.log(`${userName} left discussion: ${discussionId}`);
      
      // Emit stop typing when leaving discussion
      io.to(`discussion:${discussionId}`).emit('user-stop-typing', {
        discussionId,
        userId: socket.user._id
      });
    });
    
    // Handle chat message
    socket.on('chat-message', (message) => {
      const discussionRoom = `discussion:${message.discussionId}`;
      io.to(discussionRoom).emit('chat-message', message);
      console.log(`Message from ${userName} in ${discussionRoom}: ${message.content}`);
    });
    
    // Handle typing indicator
    socket.on('typing', ({ discussionId, user }) => {
      io.to(`discussion:${discussionId}`).emit('user-typing', {
        discussionId,
        user: {
          _id: socket.user._id,
          name: userName
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
      console.log(`User disconnected: ${userName} (${socket.id})`);
      
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