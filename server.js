require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const GroupMessage = require('./models/GroupMessage');
const PrivateMessage = require('./models/PrivateMessage');

const app = express();

app.use(express.static('public'));

connectDB()
    .then(() => {})
    .catch((err) => {});

app.use(express.json());

app.use('/api/auth', userRoutes);
app.use('/api/chat', chatRoutes);

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    socket.on('joinRoom', async (room) => {
        socket.join(room);
        io.to(room).emit('message', { username: 'System', message: `A user joined ${room}` });

        try {
            const messages = await GroupMessage.find({ room }).sort({ date_sent: 1 });
            socket.emit('loadMessages', messages);
        } catch (err) {}
    });

    socket.on('leaveRoom', (room) => {
        socket.leave(room);
        io.to(room).emit('message', { username: 'System', message: `A user left ${room}` });
    });

    socket.on('chatMessage', async (data) => {
        if (!data.username || !data.room || !data.message) {
            return;
        }

        try {
            const newMessage = new GroupMessage({
                from_user: data.username,
                room: data.room,
                message: data.message,
            });

            await newMessage.save();

            io.to(data.room).emit('message', { username: data.username, message: data.message });
        } catch (err) {}
    });

    socket.on('typing', (data) => {
        socket.to(data.room).emit('displayTyping', { username: data.username });
    });

    socket.on('disconnect', () => {});
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {});
