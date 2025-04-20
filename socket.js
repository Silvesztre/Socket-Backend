const { Server } = require("socket.io");
let socketServer;

// Track connected clients: socketId -> userId
let connectedClients = {};

const initializeSocket = (server) => {
  socketServer = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  socketServer.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // When a client registers their userId
    socket.on("register", ({ userId }) => {
      connectedClients[socket.id] = { socketId: socket.id, userId };
      console.log(`Registered user ${userId} at socket ${socket.id}`);
      broadcastClientList();
    });

    socket.on("joinRoom", async ({ senderId, chatRoomId }) => {
      socket.join(chatRoomId);
      console.log(`Sender Id: ${senderId} joined Chat Room: ${chatRoomId}`);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
      delete connectedClients[socket.id];
      broadcastClientList();
    });

    function broadcastClientList() {
      const clients = Object.values(connectedClients);
      socketServer.emit("clientList", clients);
    }
  });
};

const getSocketInstance = () => {
  if (!socketServer) throw new Error("Socket.io not initialized");
  return socketServer;
};

module.exports = {
  initializeSocket,
  getSocketInstance,
};
