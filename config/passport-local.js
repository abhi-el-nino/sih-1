const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const User = require('../models/users_schema');

passport.use(new localStrategy({
        usernameField: 'emailOrPhone'
    }, function(emailOrPhone, password, done) {


        User.findOne({ emailOrPhone: emailOrPhone }, function(err, user) {
            if (err) {
                console.log('error in finding-->passport');
                return done(err);
            }
            if (!user || user.password != password) {
                console.log('invalid username or password');
                done(null, false);
            }

            return done(null, user);
           

        });

    }


));


passport.serializeUser(function(user, done) {
    console.log('serializer')
    return done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    console.log('deserializer')
    User.findById(id, function(err, user) {
        if (err) {
            console.log('error in finding-->passport');
            return done(err);
        }
        return done(null, user);
    });
});

//check if user is authenticated or not
passport.checkAuthentication = function(req, res, next) {
    console.log("Checking auth");
    
    if (req.isAuthenticated()) {
        return next();
    }
    //if the user is not signIn
    return res.redirect('/users/sign-in');

};


//set the user for the views
passport.setAuthenticatedUser = function(req, res, next) {
    if (req.isAuthenticated()) {
       
        console.log("setting auth");
        res.locals.user = req.user;

    }
    return next();
};

module.exports = passport;