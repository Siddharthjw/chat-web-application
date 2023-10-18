const enterButton = document.getElementById('enter-button');
const usernameInput = document.getElementById('username');
const passkeyInput = document.getElementById('passkey');

enterButton.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  const passkey = passkeyInput.value.trim();

  if (passkey === '4732') {
    // Passkey is correct, send username to the server for authentication
    socket.emit('login', username);
  } else {
    // Passkey is incorrect, handle accordingly (show error message, etc.)
    console.error('Invalid passkey');
  }
});

socket.on('loginResponse', (response) => {
  if (response.success) {
    // Redirect to chat.html or perform necessary actions on successful login
    window.location.href = '/chat';
  } else {
    // Handle login failure (show error messages, clear input fields, etc.)
    console.error('Login failed:', response.error);
  }
});
