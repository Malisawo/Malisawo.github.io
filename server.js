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
        ws.send('Username already taken!');
        return ws.close();
      }
      existingUsers.push(username);
      broadcastMessage(message, ws);
    } else {
      broadcastMessage(message, ws);
    }
  });
  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
    let closedUsername = '';
    messages.forEach(msg => {
      if(msg.includes(':')){
        let msgUsername = msg.split(': ')[0];
        if(closedUsername === '' && !clients.some(client => messages.some(m => m.includes(msgUsername) && client !== ws))){
          closedUsername = msgUsername;
        }
      }
    });
    existingUsers = existingUsers.filter(user => user !== closedUsername);
  });
  ws.onerror = (error) => {
    console.error('Error occurred:', error);
  };
});

function broadcastMessage(message, sender) {
  clients.forEach(client => {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(`${message}`);
    }
  });
}

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
