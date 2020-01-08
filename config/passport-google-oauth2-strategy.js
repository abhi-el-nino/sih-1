const passport = require('passport');
const googleStrategy= require('passport-google-oauth').OAuth2Strategy;
// crypto for random passwards
const crypto= require('crypto');
const User = require('../models/User');



passport.use(new googleStrategy({
    clientID: "149360181755-4i7isui1gl8tjls1mvq60mshcs120887.apps.googleusercontent.com",
    clientSecret: "hYX04MZyHiq9q2Q1Tp1ZASYA",
    callbackURL: "http://localhost:5000/users/auth/google/callback"
   
},
function(accessToken,refreshToken,profile,done){
   
    User.findOne({email:profile.emails[0].value}).exec(function(err,user){
        if(err){console.log("error in google-passport",err);return;}

        console.log(profile);
        console.log("user:-",user);
        if(user){
            return done(null,user);
        }else{
            User.create({
                name: profile.displayName,
                emailOrPhone: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
            },function(err,user){
                if(err)
                {console.log("error in creating user",err);return ;}
                return done(null,user);
            })
        }
    });
}
))
module.exports=passport;