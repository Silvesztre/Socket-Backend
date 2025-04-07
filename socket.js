const { Server } = require('socket.io');
let socketServer;

const initializeSocket = (server) => {
    socketServer = new Server(server, {
        cors: { origin: '*', methods: ['GET', 'POST'] },
    });

    socketServer.on("connection", (socket) => {
        console.log(`New client connected: ${socket.id}`)

        socket.on("joinRoom", async ({ senderId, chatRoomId }) => {
            socket.join(chatRoomId);
            // socket.emit("roomJoined", chatRoomId);
            console.log(`Sender Id: ${senderId} Join Chat Room: ${chatRoomId}`);
        });

        socket.on("disconnect", () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
};

const getSocketInstance = () => {
    if (!socketServer) throw new Error('Socket.io not initialized');
    return socketServer;
};

module.exports = {
    initializeSocket,
    getSocketInstance,
};