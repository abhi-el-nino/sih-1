const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const Farmer = require('../models/Farmer')

passport.use(new localStrategy({
    usernameField: 'phone'
}, function (email, password, done) {


}
));

module.exports = passport;