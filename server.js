// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const colors = require('colors');



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
console.log('Online liste START = '.white, onlineUsers);


//SOCKET IO
const io = socketIO(server);



io.on('connection', (socket) => {
  console.log('client browser connected'.green);

  //username connect
  socket.on('user-connected', (data) => {
    onlineUsers.push(data);
    console.log(data);
    socket.username = data;
    console.info(data + ' connected'.green);
    //adding user til onlinelist
    console.log("Online liste: ".white, onlineUsers.white);
    io.emit('update-onlinelist', onlineUsers);
    
  });
  
  socket.on('left-chat', function(data){

    onlineUsers.forEach((user, index) => {
      if(user = data) {
        onlineUsers.splice(index, 1);
      }
    });
    io.emit('update-onlinelist', onlineUsers);
    console.log(data + ' has left the chat'.red);
    console.log("Online liste: ".white, onlineUsers.white);
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



/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));