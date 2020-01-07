const express=require('express');
const passport=require('passport');
const router=express.Router();
const usersController=require('../controllers/user_controller');
router.get('/register',usersController.register);
router.get('/login',usersController.login);
router.post('/create-session', passport.authenticate('local', { failureRedirect: '/users/sign-in' }), usersController.create_session);
module.exports=router;