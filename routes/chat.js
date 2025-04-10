const express = require('express')
const { protect } = require('../middleware/auth')
const {
    createChatRoom,
    getUserChatroom,
    createMessage,
    getChatRoomByChatRoomId,
    addUserToChatRoom,
    unsendMessage,
    getAllGroupChatRooms,
    updateMessage,
    getAllMessages,
    getMessageById
} = require('../controllers/chat');
const router = express.Router()

router.post("/", protect, createChatRoom);//tested
router.get("/chatrooms", protect, getUserChatroom);
router.post("/message", protect, createMessage);
router.get("/:chatRoomId/details", protect, getChatRoomByChatRoomId);//tested
router.post("/addUser", protect, addUserToChatRoom); 
router.put("/message/:messageId/unsend", protect, unsendMessage);//tested
router.get("/group-chatrooms", protect, getAllGroupChatRooms); 
router.put("/message/:messageId/update", protect, updateMessage);
router.get("/message", protect, getAllMessages)
router.get("/message/:messageId", protect, getMessageById)

module.exports = router