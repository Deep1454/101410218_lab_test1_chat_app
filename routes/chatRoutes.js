const express = require('express');
const {
    joinRoom,
    leaveRoom,
    sendGroupMessage,
    sendPrivateMessage,
    getGroupMessages,
    getPrivateMessages,
} = require('../controllers/chatController');
const { authenticateUser } = require('../Middleware/authmiddleware'); 

const router = express.Router();

router.use(authenticateUser);

router.post('/join', joinRoom);
router.post('/leave', leaveRoom);
router.post('/group-message', sendGroupMessage);
router.post('/private-message', sendPrivateMessage);
router.get('/group-messages/:room', getGroupMessages);
router.get('/private-messages/:to_user', getPrivateMessages);

module.exports = router;
