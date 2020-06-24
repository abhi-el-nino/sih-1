const express=require('express');
const router=express.Router();
const userController = require('../../../controllers/api/mobile/user_controller');
const passport = require('passport')

router.post('/signUp/local',userController.localSignUp)
router.post('/signUp/google',userController.googleSignUp)
router.get('/authenticate/local',userController.localLogin)
router.get('/authenticate/google',userController.googleLogin)


module.exports=router;