const express = require('express');
let bodyParser = require('body-parser');
const port = 8000;
const app = express();
const db = require('./config/mongoose');
const path=require('path');
const expressLayouts=require('express-ejs-layouts');

// setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'./assets')));
app.use('/uploads', express.static('./uploads'));

app.use(expressLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.set('view engine', 'ejs');

app.set('views', './views');

app.use('/', require('./routes'));

app.listen(port, function (err) {
    if (err) {
        console.log(err, "error");
    }
    console.log("server is running");
});