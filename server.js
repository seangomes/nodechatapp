// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const mongoose = require('mongoose');

//connect to db
mongoose.connect('mongodb://testuser:testuser@ds237669.mlab.com:37669/chatdb')
  .then(() => console.log('Database connected'))
  .catch(() => console.error('Database NOT connected'));


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

//SOCKET IO
const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('client browser connected');

  //user connect
  socket.on('user-connected', (data) => {
    socket.username = data.username;
    console.info(data + ' connected');
  });
  
  socket.on('left-chat', function(data){
    console.log(data + ' has left the chat');
  });

  socket.on('disconnect', function(){
    console.log('client browser disconnected');
  });

  socket.on('new-message', (message) => {
    console.log(message);
  });

});



/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));