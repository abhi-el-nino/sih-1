const express=require('express');
const router=express.Router();
const passport = require("passport");
const homeController=require('../../controllers/api/api_home_controller');
router.post("/submit-number",homeController.numberVerification);
router.post("/submit-otp",homeController.submitOtpfromAdmin);
router.get("/check-session",passport.authenticate('jwt',{session:false}),homeController.checkSession);
router.post("/take-action",passport.authenticate('jwt',{session:false}))
module.exports=router;