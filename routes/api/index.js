const express=require('express');
const router=express.Router();
const passport=require('passport');
const homeController=require('../../controllers/api/api_home_controller');
router.get('/',homeController.api_home);
router.get('/weather',homeController.whetherReport);
router.get('/get-all-products/:id',passport.authenticate('jwt',{session:false}),homeController.getAllPRoducts);
router.post('/register',homeController.createUser);
router.post('/create-sesion',homeController.createSession);
router.post('/upload-item',passport.authenticate('jwt',{session:false}),homeController.addProduct);
router.post('/update',passport.authenticate('jwt',{session:false}),homeController.updateProduct);

module.exports=router;