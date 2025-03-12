const joinButton = document.getElementById('join-button');
const chatWindow = document.getElementById('chat-window');
let username;
let socket;

joinButton.addEventListener('click', () => {
  if(!username){
    username = prompt('Please enter your username:', '');
    localStorage.setItem('username', username);
  }
  socket = new WebSocket(location.origin.replace('http', 'wss'));
  socket.onopen = () => {
    socket.send(`${username} joined the chat`);
    joinButton.style.display = 'none';
  };
  socket.onmessage = (event) => {
    const message = event.data;
    if(message === 'Username already taken!'){
      alert('Username already taken! Please choose another one.');
      localStorage.removeItem('username');
      joinButton.style.display = 'block';
    } else {
      addMessageToChatWindow(message);
    }
  };
  socket.onclose = () => {
    console.log('Disconnected from server');
  };
  socket.onerror = (error) => {
    console.error('Error occurred');
  };
});

function addMessageToChatWindow(message) {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  chatWindow.appendChild(messageElement);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

document.addEventListener('keypress', (event) => {
  if(event.key === 'Enter'){
    const messageInput = document.getElementById('message-input');
    socket.send(`${username}: ${messageInput.value}`);
    messageInput.value = '';
  }
});
