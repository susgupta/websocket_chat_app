const users = [];

//join user to chat
function userJoin(id, username, room) {

    //basically add the user
    const user = { id, username, room };
    users.push(user);

    return user;
};

//get current user
function getCurrentUser(id) {
    //user high-order js find method
    return users.find(user => user.id === id);
};

//user leaves chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    //make sure have something
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

//get all users in room
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}