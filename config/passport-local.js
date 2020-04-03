const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const User = require('../models/User');
const Cart=require('../models/Cart');
const Item=require('../models/item');

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
     
         
            let cart = await Cart.findOne({buyer:user._id});
          let cartItems=cart.items;
            // console.log("ii",cart);
    
            let populatedCart = await Promise.all(cartItems.map(async (item) => {
                let foundItem = await Item.findById(item.item);
                return ({
                    item: foundItem,
                    quantity: item.quantity
                })
            }));
           user.cart=[...populatedCart];
           user.cartTotal=cart.amount;

                 
            // console.log("user",user.cart);
            return done(null, user);
           
       
        
        // return done(null, user);
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
       
    // console.log('new',req.user.cart);
        
        res.locals.user = req.user;
        console.log("set response",res.locals.user.cart);

    }
    return next();
};

module.exports = passport;