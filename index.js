const express = require('express');
let bodyParser = require('body-parser');
const port = 8000;
const app = express();
const db = require('./config/mongoose');
const path=require('path');
const expressLayouts=require('express-ejs-layouts');
const session = require('express-session');
const passport=require('passport');
const passportLocal = require('./config/passport-local-strategy');
const mongoStore = require('connect-mongo')(session);

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
app.use(session({
    name: 'codial',
    secret: 'utt4MOOxHZwzmZBtEWoY1ByGUDBYqlZb',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new mongoStore({
        mongooseConnection: db,
        autoRemove: 'disbaled'
    })
},

));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', require('./routes'));

app.listen(port, function (err) {
    if (err) {
        console.log(err, "error");
    }
    console.log("server is running");
});