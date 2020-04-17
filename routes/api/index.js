const express=require('express');
const router=express.Router();
const homeController=require('../../controllers/api/api_home_controller');
router.get('/',homeController.api_home);
router.get('/weather',homeController.whetherReport);
router.get('/get-all-products/:id',homeController.getAllPRoducts);
router.post('/register',homeController.createUser);
router.post('/create-sesion',homeController.createSession);
router.post('/submit-otp',homeController.submitOtp);

router.post('/upload-item',homeController.addProduct);
router.post('/update',homeController.updateProduct);

module.exports=router;