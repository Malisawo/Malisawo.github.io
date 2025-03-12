let socket;
let username;
const usernameInput = document.getElementById('username-input');
const joinButton = document.getElementById('join-button');
const chatWindow = document.getElementById('chat-window');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button')

joinButton.addEventListener('click', () => {
  username = usernameInput.value;
  socket = new WebSocket('ws://localhost:8080');
  socket.onopen = () => {
    socket.send(`${username} joined the chat`);
  };
  socket.onerror = (error) => {
    console.log('Error occurred');
  };
  socket.onmessage = (event) => {
    const message = event.data;
    if(message === 'Username already taken!'){
      alert('Username already taken! Please choose another one.');
      localStorage.removeItem('username');
    } else {
      addMessageToChatWindow(message);
    }
  };
  socket.onmessage = (event) => {
    const message = event.data;
    addMessageToChatWindow(message);
  };
  socket.onerror = (error) => {
    console.log('Error occurred');
  };
  socket.onclose = () => {
    console.log('Connection closed');
  };
});
sendButton.addEventListener('click', () => {
  if(socket.readyState === WebSocket.OPEN){
    const message = messageInput.value;
    socket.send(`${username}: ${message}`);
    messageInput.value = '';
  }else{
    console.log('Connection not open');
  }
});
function addMessageToChatWindow(message) {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  chatWindow.appendChild(messageElement);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}