const express=require('express');
const router=express.Router();
const passport = require("passport");
const Item = require("../../models/item");
const homeController=require('../../controllers/api/api_home_controller');
const { ObjectId } = require('mongoose').Types;
router.use('/mobile',require('./mobile'))
router.post("/submit-number",homeController.numberVerification);
router.post("/submit-otp",homeController.submitOtpfromAdmin);
router.get("/check-session",passport.authenticate('jwt',{session:false}),homeController.checkSession);
router.post("/take-action",passport.authenticate('jwt',{session:false}),homeController.takeAction);
module.exports=router;