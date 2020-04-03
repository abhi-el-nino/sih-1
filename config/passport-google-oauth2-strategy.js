const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
// crypto for random passwards
const crypto = require('crypto');
const User = require('../models/User');



passport.use(new googleStrategy({
    clientID: "897366205304-4fl4vppb2l7hco1ov61t5fgc5239p1am.apps.googleusercontent.com",
    clientSecret: "QMujDlu1ZlnlEVpk0j9Ug0-_",
    callbackURL: "http://localhost:8000/users/auth/google/callback"

},
    function (accessToken, refreshToken, profile, done) {

        User.findOne({ emailOrPhone: profile.emails[0].value }).exec(function (err, user) {
            if (err) { console.log("error in google-passport", err); return; }

            // console.log(profile);
            // console.log("user:-",user);
            if (user) {
                return done(null, user);
            } else {
                User.create({
                    first_name: (profile.displayName).split(" ",2)[0],
                    last_name: (profile.displayName).split(" ",2)[1],
                    address:"New Delhi",
                    role:"buyer",
                    emailOrPhone: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function (err, user) {
                    if (err) { console.log("error in creating user", err); return; }
                    return done(null, user);
                })
            }
        });
    }
))
module.exports = passport;