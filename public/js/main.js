//get the form data
const chatForm = document.getElementById('chat-form');
//get chat messages
const chatMessages = document.querySelector('.chat-messages');
//get roomname and users dom
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//using cool query string library to get form data
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

//join the chat with server
socket.emit('joinRoom', { username, room });

//get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

//handle message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//handle message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get the message by id
    const msg = e.target.elements.msg.value;
    //emit the message to the server
    socket.emit('chatMessage', msg);

    //clear the input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

//handle output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.userName} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    //add message to dom
    document.querySelector('.chat-messages').appendChild(div);
}

//add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

//add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}