const prisma = require('../database/prisma');
const AppError = require('../utils/AppError')

exports.createChatRoomAsync = async (isGroup, groupName, users) => {
    try {
        if (!isGroup && users.length === 2) {
            const existingPrivateChat = await prisma.chatRoom.findFirst({
                where: {
                    isGroup: false,
                    AND: [
                        { users: { some: { userId: users[0] } } },
                        { users: { some: { userId: users[1] } } },
                    ],
                },
                include: {
                    users: {
                        select: {
                            userId: true
                        }
                    },
                    messages: true
                }
            });

            if (existingPrivateChat && existingPrivateChat.users.length === 2) {
                return existingPrivateChat;
            }
        }

        const chatRoom = await prisma.chatRoom.create({
            data: {
                isGroup: isGroup,
                groupName: groupName,
                users: {
                    connect: users.map(userId => ({ userId }))
                },
                createdAt: new Date()
            }
        });

        if (!chatRoom) {
            throw new AppError("Error creating chat room", 500);
        }

        return chatRoom;
    } catch (err) {
        throw err;
    }
}

exports.createMessageAsync = async(chatRoomId, senderId,content,messageType) => {
    try{
        const newMessage = await prisma.message.create({
            data: {
                sender :{
                    connect : {
                        userId : senderId
                    },
                },
                chatRoom: {
                    connect :{
                        chatRoomId: chatRoomId
                    }
                },
                content : content,
                messageType: messageType,
                createdAt : new Date()
            }
        })
        return newMessage;
    }catch (error){
        console.error(error);
        throw new AppError(`Failed to create message`, 500);
    }
}

exports.getChatRoomsByUserIdAsync = async (userId) => {
    try {
        const chatRooms = await prisma.chatRoom.findMany({
            where: {
                users: {
                    some: { userId: userId }, 
                }
            },
            include: {
                users: {
                    select: {
                        userId: true,
                        username: true,
                        email: true,
                        profileUrl: true
                    }
                },
                messages: true,
            },
        });

        return chatRooms;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

exports.getChatRoomByChatRoomIdAsync = async (chatRoomId) => {
    try {
        const chatRoom = await prisma.chatRoom.findUnique({
            where: {
                chatRoomId: chatRoomId, 
            },
            include: {
                users: {
                    select: {
                        userId: true,
                        username: true,
                        email: true,
                        profileUrl: true
                    }
                },
                messages: true,  
            },
        });

        if (!chatRoom) {
            throw new Error("Chat room not found.");
        }

        return chatRoom;
    } catch (err) {
        console.error("Error fetching chat room:", err);
        throw err;
    }
};

exports.updateMessageAsync = async (messageId, newContent) => {
    try{
        const updateMessage = await prisma.message.update({
            where: {messageId},
            data: {
                content: newContent,
                isEdited: true
            }
        })
        return updateMessage
    }catch(err){
        throw new Error('Error updating message: ' + err.message);
    }
}

exports.unsendMessageAsync = async(messageId) => {
    try{
        const unsentMessage = prisma.message.update({
            where: {messageId},
            data: {
               isUnsent: true
            }
        })
        return unsentMessage
    }catch(err){
        throw new Error('Error unsending message: ' + err.message);
    }
}

exports.addUserToChatRoomAsync = async (chatRoomId, userId) => {
    try {
        const updatedChatRoom = await prisma.chatRoom.update({
            where: { chatRoomId },
            data: {
                users: {
                    connect: { userId }
                }
            }
        });
        return updatedChatRoom;
    } catch (err) {
        throw new Error('Error adding user to chat room: ' + err.message);
    }
};

exports.getUsersInChatRoomAsync = async (chatRoomId) => {
    try {
        const chatRoom = await prisma.chatRoom.findUnique({
            where: { chatRoomId },
            include: { users: true }
        });
        return chatRoom.users;
    } catch (err) {
        throw new Error('Error fetching users in chat room: ' + err.message);
    }
};

exports.getMessageByMessageIdAsync = async (messageId) => {
    try {
        const message = await prisma.message.findUnique({
            where: { messageId },
            include: {
                sender: { select: { userId: true, username: true } }, 
                chatRoom: { select: { chatRoomId: true, groupName: true } }, 
            },
        });

        if (!message) {
            throw new Error("Message not found.");
        }

        return message;
    } catch (err) {
        console.error("Error fetching message:", err);
        throw err;
    }
};

exports.getAllGroupChatRoomsAsync = async () => {
    try {
        const groupChatRooms = await prisma.chatRoom.findMany({
            where: {
                isGroup: true, 
            },
            select: {
                chatRoomId: true, 
                groupName: true,
                users: {
                    select: {
                        userId: true,
                        username: true,
                    },
                },
                createdAt: true,
            },
        });

        return groupChatRooms;
    } catch (err) {
        console.error('Error fetching group chat rooms:', err);
        throw new Error('Error fetching group chat rooms: ' + err.message);
    }
};

exports.getAllMessages = async () => {
    try {
        const messages = await prisma.message.findMany()

        return messages
    } catch (err) {
        console.error('Error fetching all messages:', err);
        throw new Error('Error fetching all messages: ' + err.message);
    }
}

exports.getMessageById = async (messageId) => {
    try {
        const message = await prisma.message.findUnique({
            where: {
                messageId: messageId
            }
        })

        if (!message) {
            throw new Error("Message not found.");
        }

        return message

    } catch (err) {
        console.error('Error fetching a message:', err);
        throw new Error('Error fetching a message: ' + err.message);
    }
}