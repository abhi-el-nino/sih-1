
const mongoose =require('mongoose');
mongoose.connect('mongodb://localhost/buyfresh');
mongoose.set('useFindAndModify', false);
const db = mongoose.connection; //gives acess to database
// if error
db.on('error', console.error.bind('error connecting to db '));
// if success
db.once('open', function() {
    console.log("success");
});

module.exports = db;