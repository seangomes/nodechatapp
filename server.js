// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const colors = require('colors');
var cors = require('cors')




//connect to db
mongoose.connect('mongodb://testuser:testuser@ds237669.mlab.com:37669/chatdb')
  .then(() => console.log('Database connected'))
  .catch(() => console.error('Database NOT connected'));


//Delete all record in MongoDB at server start!
var User = require('./server/models/user.js');

User.remove({}, function(err, records) {
  console.log("All users deleted in MONGO".red);
});


// Get our API routes
const api = require('./server/routes/api');

const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

app.use(cors());

// Set our api routes
app.use('/api', api);

// Catch all other routes and return the index file

var jsonParser = bodyParser.json()

//MUST BE THE LAST ROUTE BECAUSE OF * NOTATION
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });

 
 /**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

var onlineUsers = [];
console.log('Online liste START = '.blue, onlineUsers);


//SOCKET IO
const io = socketIO(server);



io.on('connection', (socket) => {
  console.log('client browser connected'.green);

  //username connect
  socket.on('user-connected', (data) => {
    onlineUsers.push(data);
    console.info(data.username + ' connected'.green);
    //adding user til onlinelist
    console.log("Online liste: ".blue, onlineUsers.white);
    io.emit('update-onlinelist', onlineUsers);
    
    let messageFromServer = {
      username: 'Server',
      message: data.username + ' har joinet chatten!',
      timestamp: genereateTimeStamp(),
      sender: 'server'
    }
    io.emit('new-message', messageFromServer);

    
  });
  
  socket.on('left-chat', function(data){
    console.log(data);
    onlineUsers.forEach((user, index) => {
      console.log(user.username);
      if(user.username == data) {
        onlineUsers.splice(index, 1);
        console.log("Online liste: ".blue, onlineUsers.white);
      }
    });
    io.emit('update-onlinelist', onlineUsers);
    console.log(data + ' has left the chat'.red);

    let messageFromServer = {
      username: 'Server',
      message: data + ' har forladt chatten!',
      timestamp: genereateTimeStamp(),
      sender: 'server'
    }
    io.emit('new-message', messageFromServer);

  });

  socket.on('disconnect', function(){
    console.log('client browser disconnected'.red);
  });

  socket.on('new-message', (messageObj) => {
    console.log(messageObj.gray);
    console.log(messageObj.username + ' sendt : '.yellow, messageObj.message.yellow );
    io.emit('new-message', messageObj);
  });

});

//Sætter tiden på message sent
function genereateTimeStamp()  {
  let today = new Date();
  let h = today.getHours();
  let m = today.getMinutes();
  let s = today.getSeconds();

  let timestamp = h + ":" + m + ":" + s;
  return timestamp;
}

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));