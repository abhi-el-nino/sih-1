const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const User = require('../models/User');

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
   
    return done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
 console.log('deserialiser');
   let user=await  User.findById(id);
     
            // console.log('error in finding-->passport');
            // return done(err);
        let newUser={
            ...user,
            k:12
        }
        
        return done(null, newUser);
    });

//check if user is authenticated or not
passport.checkAuthentication = function(req, res, next) {
    
    if (req.isAuthenticated()) {
        return next();
    }
    //if the user is not signIn
    return res.redirect('/');

};


//set the user for the views
passport.setAuthenticatedUser = function(req, res, next) {
    if (req.isAuthenticated()) {
       
    console.log('new',req.user.k);
        
        res.locals.user = req.user;

    }
    return next();
};

module.exports = passport;