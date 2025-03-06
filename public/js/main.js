document.addEventListener('DOMContentLoaded', () => {
    const roomSelectionScreen = document.getElementById('room-selection');
    const loginScreen = document.getElementById('login-screen');
    const chatScreen = document.getElementById('chat-screen');
    const loginBtn = document.getElementById('login-btn');
    const sendBtn = document.getElementById('send-btn');
    const usernameInput = document.getElementById('username');
    const messageInput = document.getElementById('message-input');
    const messagesContainer = document.getElementById('messages');

    let username = '';
    let roomId = '';

    // Room 선택 버튼 이벤트 처리
    roomSelectionScreen.querySelectorAll('.room-btn').forEach(button => {
        button.addEventListener('click', () => {
            roomId = button.getAttribute('data-room');
            window.location.href = `/${roomId}`;
        });
    });

    // URL에서 roomId 추출
    roomId = window.location.pathname.split('/').pop();
    if (roomId && roomId.startsWith('room')) {
        roomSelectionScreen.style.display = 'none';
        loginScreen.style.display = 'block';
    }

    loginBtn.addEventListener('click', () => {
        username = usernameInput.value.trim();
        if (username) {
            loginScreen.style.display = 'none';
            chatScreen.style.display = 'block';
            fetchMessages();
        }
    });

    sendBtn.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message) {
            fetch(`/api/messages/${roomId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, message }),
            }).then(fetchMessages);
            messageInput.value = '';
        }
    });

    function fetchMessages() {
        fetch(`/api/messages/${roomId}`)
            .then(response => response.json())
            .then(data => {
                messagesContainer.innerHTML = '';
                data.forEach(msg => {
                    const messageDiv = document.createElement('div');
                    messageDiv.classList.add(msg.username === username ? 'chat-message-right' : 'chat-message-left');
                    messageDiv.innerHTML = `
                        <div>
                            <strong>${msg.username}</strong>
                            <p>${msg.message}</p>
                            <small>${new Date(msg.time).toLocaleTimeString()}</small>
                        </div>
                    `;
                    messagesContainer.appendChild(messageDiv);
                });
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            });
    }

    setInterval(fetchMessages, 5000);
});
