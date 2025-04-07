const express = require('express')
const { protect } = require('../middleware/auth')
const {
    createChatRoom,
    getUserChatroom,
    createMessage,
    getChatRoomByChatRoomId,
    addUserToChatRoom,
    unsendMessage
} = require('../controllers/chat');
const router = express.Router()

router.post("/", protect, createChatRoom);//tested
router.get("/chatrooms", protect, getUserChatroom);
router.post("/message", protect, createMessage);
router.get("/:chatRoomId/details", protect, getChatRoomByChatRoomId);//tested
router.post("/addUser", protect, addUserToChatRoom); 
router.put("/message/:messageId/unsend", protect, unsendMessage);//tested

module.exports = router