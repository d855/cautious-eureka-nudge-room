var express = require('express');
var app = express();
app.use(express.static('public'));

var server = require('http').createServer(app)
var io = require('socket.io')(server);

var allUsers = [];
var avatars = [
    'https://lthumb.lisimg.com/806/20669806.jpg?width=411&sharpen=true',
    'https://www.w3schools.com/w3images/avatar2.png',
    'https://www.w3schools.com/howto/img_avatar2.png'
];

io.on('connection', (socket) => {
    console.log('Client connected');
    
    socket.on('message', function(username) {
        allUsers.push({
            id: socket.id,
            avatar: avatars[Math.round(Math.random() * (avatars.length - 1))],
            name: username,
        });
        io.emit('sendUserList', allUsers)
    })

    socket.on('pingUser', function(user) {
        io.to(user).emit('nudgeUser');
    })

    socket.on('disconnect', function() {
        console.log('User disconnected')
        for(var i = 0; i < allUsers.length; i++){
            if(allUsers[i] == socket.id){
                allUsers.splice(i, 1)
                io.emit('sendUserList', allUsers)
                break;
            }
        }
    })
})

server.listen(3000, function(){
    console.log('Server is running on http://localhost:3000');
})