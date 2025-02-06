const socket = io();
let currentRoom = '';
let username = localStorage.getItem('username'); 

if (!username) {
    alert("You must be logged in to access the chat.");
    window.location.href = 'login.html';
}

document.getElementById('joinRoom').addEventListener('click', () => {
    const room = document.getElementById('roomSelect').value;
    if (currentRoom) {
        socket.emit('leaveRoom', currentRoom);
    }
    currentRoom = room;
    socket.emit('joinRoom', room);

    document.getElementById('chatBox').style.display = 'block';
    document.getElementById('messageInputContainer').classList.remove('d-none');
    document.getElementById('leaveRoom').classList.remove('d-none');
});

document.getElementById('messageInput').addEventListener('input', () => {
    socket.emit('typing', { username, room: currentRoom });
});

socket.on('displayTyping', (data) => {
    const typingIndicator = document.getElementById('typingIndicator');
    typingIndicator.innerText = `${data.username} is typing...`;
    typingIndicator.style.display = 'block';
});

document.getElementById('sendMessage').addEventListener('click', () => {
    const message = document.getElementById('messageInput').value.trim();
    if (!message) return;
    if (!username) return;

    socket.emit('chatMessage', { room: currentRoom, message, username });

    document.getElementById('messageInput').value = ''; 
});

socket.on('message', (data) => {
    const messagesList = document.getElementById('messages');
    const messageElement = document.createElement('li');
    messageElement.classList.add('mb-2');
    messageElement.innerHTML = `<strong>${data.username}:</strong> ${data.message}`;
    messagesList.appendChild(messageElement);
});

socket.on('loadMessages', (messages) => {
    const messagesList = document.getElementById('messages');
    messagesList.innerHTML = '';
    messages.forEach(msg => {
        const messageElement = document.createElement('li');
        messageElement.classList.add('mb-2');
        messageElement.innerHTML = `<strong>${msg.from_user}:</strong> ${msg.message}`;
        messagesList.appendChild(messageElement);
    });
});

document.getElementById('leaveRoom').addEventListener('click', () => {
    if (!currentRoom) return;

    socket.emit('leaveRoom', currentRoom);

    document.getElementById('chatBox').style.display = 'none';
    document.getElementById('messageInputContainer').classList.add('d-none');
    document.getElementById('leaveRoom').classList.add('d-none'); 
    currentRoom = '';
});

document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'signin.html';
});
