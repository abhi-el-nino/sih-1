const express=require('express');
const router=express.Router();
const passport=require('passport');
const orderController = require('../controllers/order_controller');
const paymentController = require('../controllers/payment_controller');

router.post('/checkout',orderController.checkout);
router.get('/shopping-cart',orderController.shoppingCart);
router.post('/add-to-cart',passport.checkAuthentication,orderController.toggleCart);
router.get("/buy_product/:id",orderController.buyProduct);
router.use('/payment',paymentController);
router.get('/transactionFailed',orderController.transactionFailed);
router.get('/checkout',orderController.checkout);
module.exports=router;