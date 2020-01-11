
const Message = require('../models/message');
var chatIds = [];
module.exports.chatSockets = function (socketServer) {
    let io = require('socket.io')(socketServer);

    io.sockets.on('connection', function (socket) {

        socket.on('disconnect', function () {
            console.log('socket disconnected!');
            for (let i = 0; i < chatIds.length; i++) {

                if (chatIds[i].id == socket.id) {
                    chatIds.splice(i, 1);
                }
            }
            io.emit('exit', this.users);
        });


        socket.on('join_chat', function (data) {
            let user = {
                userId: data.user_email,
                socketId: socket.id
            }

            chatIds.push(user); 
        });

         // CHANGE :: Invite farmer to chat and negotiate
        socket.on('send_invite',function (data) {
         
            var socketId = '';
            for (let i = 0; i < chatIds.length; i++) {
           
                let user = chatIds[i];
                if (user.userId == data.farmerId) {
                    socketId = user.socketId
                }
            }
            socket.broadcast.to(socketId).emit('invite_received', data);
           
        });

        // CHANGE :: detect send_message and broadcast to everyone in the room
        socket.on('send_message', async function (data) {
            await Message.create({
                message: data.message,
                sender: data.user_email
            })
            var socketId = '';
            let receiverId='';
            if(data.userType =="farmer"){
                receiverId=data.buyerId;
            }else{
                receiverId=data.farmerId;
            }
            for (let i = 0; i < chatIds.length; i++) {
                let user = chatIds[i];
                if (user.userId == receiverId) {
                    socketId = user.socketId
                }
            }
            socket.broadcast.to(socketId).emit('receive_message', data); 
        });
    });
}