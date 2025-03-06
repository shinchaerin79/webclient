// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

let chatRooms = {};

// 채팅방 접속 엔드포인트
app.get('/:roomId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 메시지 처리 엔드포인트
app.post('/api/messages/:roomId', (req, res) => {
    const { roomId } = req.params;
    const { username, message } = req.body;
    if (!chatRooms[roomId]) {
        chatRooms[roomId] = [];
    }

    const newMessage = {
        id: chatRooms[roomId].length + 1,
        username,
        message,
        time: new Date().toISOString()
    };

    chatRooms[roomId].push(newMessage);
    res.send({ success: true, message: newMessage });
});

app.get('/api/messages/:roomId', (req, res) => {
    const { roomId } = req.params;
    if (!chatRooms[roomId]) {
        chatRooms[roomId] = [];
    }

    res.send(chatRooms[roomId]);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
