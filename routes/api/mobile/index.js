const express=require('express');
const router=express.Router();
const userController = require('../../../controllers/api/mobile/user_controller');
const passport = require('passport')

router.use('/user',require('./user'))

module.exports=router;