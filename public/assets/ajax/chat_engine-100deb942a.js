class ChatEngine{constructor(e,s){this.chatBox=$("#"+e),this.userEmail=s,this.socket=io.connect("http://localhost:5000"),this.userEmail&&this.connectionHandler(),this.consoler()}connectionHandler(){let e=this,s=this;this.socket.on("connect",(function(){e.socket.emit("join_chat",{user_email:e.userEmail}),e.socket.on("user_joined",(function(e){console.log("a user joined!",e)}))})),$("#send-message").click((function(){let e=this,t=$("#chat-message-input").val(),a=$(e).attr("data-farmerId"),l=$(e).attr("data-buyerId"),i=$(e).attr("data-userType");if(""!=t){s.socket.emit("send_message",{message:t,user_email:e.userEmail,farmerId:a,buyerId:l,userType:i});let o=$("<li>");o.append($("<span>",{html:t})),o.addClass("self-message"),$("#chat-message-input").val(""),$("#chat-messages-list").append(o),$("#chat-messages-list").scrollTop($("#chat-messages-list")[0].scrollHeight)}$("#chat-messages-list").scrollTop($("#chat-messages-list")[0].scrollHeight)})),$("#negotiate-button").click((function(){let e=$(this).attr("data-farmerId"),t=$(this).attr("data-buyerId");console.log("Invite sent"),s.socket.emit("send_invite",{user_email:this.userEmail,farmerId:e,buyerId:t})})),e.socket.on("receive_message",(function(e){let s=$("<li>");s.append($("<span>",{html:e.message})),s.addClass("other-message"),$("#chat-messages-list").append(s),$("#chat-messages-list").scrollTop($("#chat-messages-list")[0].scrollHeight)})),e.socket.on("receive_message_online",(function(e){$("#user-chat-box").addClass("show"),oldMessages.forEach(s=>{let t=$("<li>"),a="";a=s.sender==e.receiverId?"self-message":"other-message",t.append($("<span>",{html:e.message})),t.addClass(a),$("#chat-messages-list").append(t),$("#chat-messages-list").scrollTop($("#chat-messages-list")[0].scrollHeight)});let s=$("<div>Unread Messages</div>");$("#user-chat-box").append(s);let t=$("<li>");t.append($("<span>",{html:e.content})),t.addClass("other-message"),$("#chat-messages-list").append(t),$("#chat-messages-list").scrollTop($("#chat-messages-list")[0].scrollHeight)})),e.socket.on("invite_received",(function(e){console.log("invite received",e.message),$("#send-message").attr("data-buyerId",e.buyerId),$("#send-message").attr("data-userType","farmer"),$("#user-chat-box").addClass("show")})),$("#lock-buyer").click((function(){let e=$("#chat-message-lock-container");e.submit((function(s){s.preventDefault(),$.ajax({type:"post",url:"/shop/:id",data:e.serialize(),success:function(e){},error:function(e){console.log(e.responseText)}})}))}))}}