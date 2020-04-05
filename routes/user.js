const express=require('express');
const passport=require('passport');
const router=express.Router();
const usersController=require('../controllers/user_controller');
router.get('/register',usersController.register);
router.get('/login',usersController.login);
router.post('/create-user',usersController.createUser);
router.get('/logout',usersController.destroySession);
router.post('/create-session', passport.authenticate('local', 
{ failureRedirect: '/users/login',
failureFlash: "Invalid username or password!",
successFlash: "Logged you in!" }), usersController.create_session);
router.get('/auth/google',passport.authenticate('google',{scope :['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'./signin'}),usersController.create_session);


module.exports=router;