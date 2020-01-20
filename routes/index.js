const express=require('express');
const router=express.Router();
const passport=require('passport');
const homeController=require('../controllers/home_controller');
const itemController=require('../controllers/items_controller');
router.get('/',homeController.home);
router.post('/shop/:id',homeController.shop);
router.get('/contact',homeController.contact);
router.get('/shopping-cart',homeController.shoppingCart);
router.post('/add-to-cart',passport.checkAuthentication,itemController.toggleCart);
router.get("/buy_product/:id",homeController.buyProduct);
router.use('/api',require('./api'));
router.post('/upload-item',passport.checkAuthentication,itemController.upload);
router.use('/users',require('./user'));
router.get('/upload-form',passport.checkAuthentication,homeController.upload_form);
router.post('/sms',homeController.sms);
router.get('/sms',homeController.showSms)

module.exports=router;