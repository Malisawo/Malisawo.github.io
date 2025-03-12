const express = require('express');
const app = express();
const server = require('http').createServer(app);
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });
let clients = [];
let existingUsers = [];
let messages = [];

app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

wss.on('connection', (ws) => {
  clients.push(ws);
  console.log('Client connected');
  ws.on('message', (message) => {
    if(message.includes('joined the chat')){
      let username = message.split(' joined the chat')[0];
      if(existingUsers.includes(username)){
        return ws.close();
      }
      existingUsers.push(username);
      broadcastMessage(message);
    }else{
      broadcastMessage(message);
    }
  });
  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
    let closedUsername = '';
    messages.filter(msg => {
      if(msg.includes(':')){
        let msgUsername = msg.split(': ')[0];
        if(clients.findIndex(client => 
          messages.find(msg => msg.includes(msgUsername)) 
          === messages.find(msg => client === ws && msg.includes(msgUsername))) !== -1){
          closedUsername = msgUsername;
        }
        return true;
      }
    });
    existingUsers = existingUsers.filter(user => user !== closedUsername);
  });
  ws.onerror = (error) => {
    console.error('Error occurred');
  };
});

function broadcastMessage(message) {
  clients.forEach(client => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(`${message}`);
    }
  });
}

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
