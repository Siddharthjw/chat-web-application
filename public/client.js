const socket = io();

const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const chatMessages = document.getElementById('chat-messages');
const userList = document.getElementById('user-list');

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (message) {
    socket.emit('message', message);
    messageInput.value = '';
  }
});

socket.on('userList', (users) => {
  userList.textContent = 'Users online: ' + users.join(', ');
});

socket.on('message', (data) => {
  const messageElement = document.createElement('div');
  messageElement.textContent = `${data.user}: ${data.message}`;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});
