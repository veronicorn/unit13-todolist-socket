const express = require('express');
const app = express();
const server = require('http').createServer(app);       //new
const io = require('socket.io')(server);                //also new
const mongoose = require('mongoose');
const PORT = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// mongoose.connect('mongodb://user:password@ds035907.mlab.com:35907/heroku_2ccg3x3c', { useNewUrlParser: true });
mongoose.connect('mongodb://localhost/SocketToDo',{ useNewUrlParser: true });

require('./sockets/todo-sockets')(io);
require('./routes/html-routes')(app);
require('./routes/api-routes')(app);

server.listen(PORT, () => {
    console.log(`App is now listening on PORT ${PORT}`);
})