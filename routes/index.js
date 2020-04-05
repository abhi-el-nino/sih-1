const express=require('express');
const router=express.Router();
const passport=require('passport');
const homeController=require('../controllers/home_controller');
const itemController=require('../controllers/items_controller');
const mapsController=require('../controllers/maps_controller');
router.get('/',homeController.home);
router.get('/change-center',mapsController.changeCenter);
router.get('/contact',homeController.contact);
router.use('/api',require('./api'));
router.post('/upload-item',passport.checkAuthentication,itemController.upload);
router.use('/users',require('./user'));
router.post('/sms',homeController.sms);
router.get('/sms',homeController.showSms)
router.use('/farmer',require('./farmer.js'));
router.use('/maps',require('./maps'));
router.use('/order',passport.checkAuthentication,require('./order'));
module.exports=router;