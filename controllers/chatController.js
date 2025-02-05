const GroupMessage = require('../models/GroupMessage');
const PrivateMessage = require('../models/PrivateMessage');

exports.joinRoom = async (req, res) => {
    const { room } = req.body;
    if (!room) return res.status(400).json({ error: 'Room is required' });

    res.status(200).json({ message: `Joined room: ${room}` });
};

exports.leaveRoom = async (req, res) => {
    const { room } = req.body;
    if (!room) return res.status(400).json({ error: 'Room is required' });

    res.status(200).json({ message: `Left room: ${room}` });
};

exports.sendGroupMessage = async (req, res) => {
    const { room, message } = req.body;

    if (!room || !message) return res.status(400).json({ error: 'Room and message are required' });

    try {
        const newMessage = new GroupMessage({
            from_user: req.user.id || req.user._id,
            room,
            message,
        });

        await newMessage.save();
        res.status(201).json({ message: 'Message sent and stored successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error saving message' });
    }
};

exports.sendPrivateMessage = async (req, res) => {
    const { to_user, message } = req.body;

    if (!to_user || !message) return res.status(400).json({ error: 'Recipient and message are required' });

    try {
        const newMessage = new PrivateMessage({
            from_user: req.user.id || req.user._id,
            to_user,
            message,
        });

        await newMessage.save();
        res.status(201).json({ message: 'Private message sent and stored successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error saving private message' });
    }
};

exports.getGroupMessages = async (req, res) => {
    const { room } = req.params;

    try {
        const messages = await GroupMessage.find({ room }).sort({ date_sent: 1 });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching group messages' });
    }
};

exports.getPrivateMessages = async (req, res) => {
    const { to_user } = req.params;

    try {
        const messages = await PrivateMessage.find({
            $or: [
                { from_user: req.user.id || req.user._id, to_user },
                { from_user: to_user, to_user: req.user.id || req.user._id },
            ],
        }).sort({ date_sent: 1 });

        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching private messages' });
    }
};
