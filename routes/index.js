const express=require('express');
const router=express.Router();
const passport=require('passport');
const homeController=require('../controllers/home_controller');
const itemController=require('../controllers/items_controller');
router.get('/',homeController.home);
router.post('/shop/:id',homeController.shop);
router.get('/contact',homeController.contact);
router.get('/shopping-cart',homeController.shoppingCart);
router.get("/buy_product/:num",homeController.buyProduct);
router.use('/api',require('./api'));
router.post('/upload-item',passport.checkAuthentication,itemController.upload);
router.use('/users',require('./user'));
router.post('/sms',(req,res)=>{
  console.log(req.params);
  return res.send('200');
})

module.exports=router;