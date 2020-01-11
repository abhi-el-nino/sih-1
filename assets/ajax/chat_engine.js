class ChatEngine{
    constructor(chatBoxId, userId,senderId){
        this.first=userId;
        this.second=senderId;
        this.chatBox = $(`#${chatBoxId}`);
        this.userId = userId;
    
        this.socket = io.connect('http://localhost:5000');

        if (this.userId){
            this.connectionHandler();
        }
        this.consoler();

    }

consoler(){
    console.log(this.first,this.second);
}
    connectionHandler(){
        let self = this;

        this.socket.on('connect', function(){
            console.log('connection established using sockets...!');


            self.socket.emit('join_room', {
                user_email: self.userId,
                chatroom: 'codeial'
            });

            self.socket.on('user_joined', function(data){
                console.log('a user joined!', data);
            })


        });

        // CHANGE :: send a message on clicking the send message button
        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();

            if (msg != ''){
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userId,
                    chatroom: 'codeial'
                });
            }
            $('#chat-messages-list').scrollTop($("#chat-messages-list")[0].scrollHeight);
        });

        self.socket.on('receive_message', function(data){
            console.log('message received', data.message);


            let newMessage = $('<li>');

            let messageType = 'other-message';

            if (data.user_email == self.userId){
                messageType = 'self-message';
            }

            newMessage.append($('<span>', {
                'html': data.message
            }));

            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);
            $('#chat-messages-list').scrollTop($("#chat-messages-list")[0].scrollHeight);
        })
    }
}