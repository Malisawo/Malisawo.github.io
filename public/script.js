const joinButton = document.getElementById('join-button');
const chatWindow = document.getElementById('chat-window');
const messageInput = document.getElementById('message-input');
let username;
let socket;

console.log('Script loaded');
joinButton.addEventListener('click', () => {
  console.log('Join button clicked');
  if(!username){
    username = prompt('Please enter your username:', '');
    localStorage.setItem('username', username);
    console.log('Username set:', username);
  }
  socket = new WebSocket(location.origin.replace('http', 'wss'));
  console.log('WebSocket connection established');
  socket.onopen = () => {
    console.log('Connection open, sending join message');
    socket.send(`${username} joined the chat`);
    joinButton.style.display = 'none';
  };
  socket.onmessage = (event) => {
    console.log('Received message:', event.data);
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
  console.log('Message added to chat window');
}

document.addEventListener('keypress', (event) => {
  if(event.key === 'Enter'){
    if (socket && socket.readyState === WebSocket.OPEN) {
      const userInput = messageInput.value;
      console.log('Sending message:', userInput);
      socket.send(`${username}: ${userInput}`);
      messageInput.value = '';
    } else {
      console.error('WebSocket is not open. Cannot send message.');
    }
  }
});
