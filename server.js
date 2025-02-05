require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

connectDB()
    .then(() => console.log('Database connected successfully'))
    .catch((err) => console.error('Database connection failed:', err.message));

app.use(express.json());
app.use(express.static('public'));

app.use('/api/auth', userRoutes);
app.use('/api/chat', chatRoutes);

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    socket.on('joinRoom', ({ username, room }) => {
        socket.join(room);
        io.to(room).emit('message', `${username} has joined the room`);
    });

    socket.on('chatMessage', (data) => {
        const { room, message, username } = data;
        io.to(room).emit('message', { username, message });
    });

    socket.on('disconnect', () => {});
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
