const express=require('express');
const router=express.Router();
const homeController=require('../controllers/home_controller');
router.get('/',homeController.home);
router.get('/register',homeController.register);
router.use('/api',require('./api'));
module.exports=router;