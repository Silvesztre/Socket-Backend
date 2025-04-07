const {
    createChatRoomAsync,
    createMessageAsync,
    getChatRoomsByUserIdAsync,
    getChatRoomByChatRoomIdAsync,
    addUserToChatRoomAsync,
    updateMessageAsync,
    unsendMessageAsync,
    getUsersInChatRoomAsync,
    getMessageByMessageIdAsync,
    getAllGroupChatRoomsAsync 
} = require('../repositories/Chat');const AppError = require('../utils/AppError');

const {getSocketInstance} = require('../socket');
const { user } = require('../database/prisma');

exports.createChatRoom = async (req, res, next) => {
    try{
        const {users, isGroup, groupName} = req.body;

        if (!Array.isArray(users)) {
            return res.status(400).json({
                success: false,
                message: 'Users mut be an array'
            });
        }

        const chatRoom = await createChatRoomAsync(isGroup,groupName,users)

        if (!chatRoom) {
            throw new Error('Chat room creation failed');
          }

        res.status(200).json({success: true, data: "chatRoom"})

    }catch(err){
        res.status(500).json({success: false})
        console.log(err.stack)
    }
}


exports.createMessage = async (req,res,next) => {
    try{
        const validMessageTypes = [ 'MESSAGE', 'IMAGE' ];
        const { chatRoomId, messageType, content } = req.body;
        const senderId = req.user.userId
        if(!chatRoomId || !senderId || !content || !messageType){
            next(new AppError("Bad request not all required field", 400));
        }
        // if (senderId !== req.user.userId) {
        //     return res.status(403).json({ message: 'Forbidden: senderId does not match authenticated user' });
        // }

        if (!validMessageTypes.includes(messageType)) {
            return res.status(400).json({ message: 'Invalid message type' });
        }

        const chatRoom = await getChatRoomByChatRoomIdAsync(chatRoomId);
        if(!chatRoom){
            return res.status(404).json({ message: 'Chat room not found' });
        }

        const isUserInChatRoom = chatRoom.users.some(user => user.userId === senderId);
        if (!isUserInChatRoom) {
            return res.status(401).json({ message: 'Unauthorized: User not in chat room' });
        }

        const newMessage = await createMessageAsync(chatRoomId,senderId,content,messageType);

        const io = getSocketInstance();
        io.to(newMessage.chatRoomId).emit("receiveMessage", {
            newMessage,
        })

        return res.status(201).json({
            status: 'success',
            data: { newMessage }
        });
    }catch(err){
        return next(new AppError(err.message || "Internal Server Error", 500));
    }
}

exports.getUserChatroom = async (req,res,next) =>{
    try {
        const userId= req.user.userId
        if(!userId){
            return next(new AppError("Bad request", 400));
        }
        
        const chatRooms = await getChatRoomsByUserIdAsync(userId)



        res.status(200).json({
            chatRooms
        })
    }catch(error){
        next(error)
    }
}



exports.getChatRoomByChatRoomId = async (req, res, next) => {
    try {

        const { chatRoomId } = req.params;
        const chatRoom = await getChatRoomByChatRoomIdAsync(chatRoomId);
        const userId = req.user.userId;
        if (chatRoom) {
            const isUserInChatRoom = chatRoom.users.some(user => user.userId === userId);
            if (!isUserInChatRoom) {
                return res.status(401).json({ message: 'Unauthorized: User not in chat room' });
            }

            return res.status(200).json({
                success: true,
                data: chatRoom
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "Chat room not found."
            });
        }
    } catch (err) {
        console.error("Error in getChatRoomByChatRoomId controller:", err);
        next(err);
    }
};

exports.updateMessage = async (req, res, next) => {
    try {
        const { messageId, content} = req.body;
        const userId = req.user.userId; 

        if (!messageId || !content) {
            return next(new AppError("Bad request", 400));
        }

        const message = await getMessageByMessageIdAsync(messageId);
        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found."
            });
        }

        if (message.sender.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this message"
            });
        }

        const updatedMessage = await updateMessageAsync(messageId, content);

        return res.status(200).json({
            success: true,
            data: updatedMessage
        });
    } catch (err) {
        return next(new AppError(err.message || "Internal Server Error", 500)); 
    }
};


exports.unsendMessage = async (req, res, next) => {
    try {
        const { messageId } = req.params;
        const userId = req.user.userId; 

        if (!messageId) {
            return next(new AppError("Bad request", 400));
        }
        const message = await getMessageByMessageIdAsync(messageId);

        if (message.sender.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this message"
            });
        }



        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found."
            });
        }

        if (message.sender.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to unsend this message"
            });
        }

        const unsentMessage = await unsendMessageAsync(messageId);
        return res.status(200).json({
            success: true,
            data: unsentMessage
        });
    } catch (err) {
        return next(new AppError(err.message || "Internal Server Error", 500)); 
    }
};

exports.getUsersInChatRoom = async (req, res, next) => {
    try {
        const { chatRoomId } = req.params;

        if (!chatRoomId) {
            return next(new AppError("Bad request", 400));
        }

        const usersInChatRoom = await getUsersInChatRoomAsync(chatRoomId);

        return res.status(200).json({
            success: true,
            data: usersInChatRoom
        });
    } catch (err) {
        return next(new AppError("Internal Server Error", 500));
    }
};


exports.addUserToChatRoom = async (req, res, next) => {
    try {
        const { chatRoomId} = req.body;
        const userId = req.user.userId;
        if (!chatRoomId ) {
            return next(new AppError("Bad request: Must provide chatRoomId and a userId.", 400));
        }
        const chatRoom = await getChatRoomByChatRoomIdAsync(chatRoomId);
        if (!chatRoom) {
            return next(new AppError("Chat room not found", 404));
        }

        const isUserInChatRoom = chatRoom.users.some(user => user.userId === userId);
        if (isUserInChatRoom) {
            return res.status(400).json({ message: "You are already in the chat room." });
        }

        if(!chatRoom.isGroup){
            return res.status(400).json({ message: "You cannot join private chat." });
        }


        const updatedChatRoom = await addUserToChatRoomAsync(chatRoomId, userId);
        res.status(200).json({
            success: true,
            data: updatedChatRoom
        });

    } catch (error) {
        return next(new AppError(err.message || "Internal Server Error", 500)); 
    }
};

exports.getAllGroupChatRooms = async (req, res, next) => {
    try {
        const groupChatRooms = await getAllGroupChatRoomsAsync();

        res.status(200).json({
            success: true,
            data: groupChatRooms
        });
    } catch (err) {
        return next(new AppError(err.message || "Internal Server Error", 500)); 
    }
};