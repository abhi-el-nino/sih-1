const express=require('express');
const router=express.Router();
const homeController=require('../controllers/home_controller');
router.get('/',homeController.home);
router.get('/contact',homeController.contact);
router.get('/shopping-cart',homeController.shoppingCart);
router.use('/api',require('./api'));
router.use('/users',require('./user'));
module.exports=router;