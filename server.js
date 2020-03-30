const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');
const CHAT_BOT_NAME = 'SushilChat Bot';

const app = express();
//need tp create http server to support socket io, but wrap around express app
const server = http.createServer(app);
//initialize socket io
const io = socketio(server);

//set static folder - this will serve up the FE html
app.use(express.static(path.join(__dirname, 'public')));

//run when client connects
io.on('connection', socket => {

    //when someone joins room
    socket.on('joinRoom', ({ username, room }) => {

        //create the user
        const user = userJoin(socket.id, username, room);

        //join on room
        socket.join(user.room);

        //welcome current user
        socket.emit('message', formatMessage(CHAT_BOT_NAME, 'Welcome to SushilChat'));

        //broadcast when a user connects - to all clients in the room, except the connecting client
        socket.broadcast.to(user.room).emit('message', formatMessage(CHAT_BOT_NAME, `${user.username} has joined the chat`));

        //send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });

    });

    //listen for chat message
    socket.on('chatMessage', (msg) => {
        //get the current user
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    //runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        //remove if user existed in first place
        if (user) {
            //emit to everyone that user has left the chat
            io.to(user.room).emit('message', formatMessage(CHAT_BOT_NAME, `${user.username} has left the chat`));

            //send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }

    });
});

const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));