const express=require('express');
const router=express.Router();
const homeController=require('../../controllers/api/api_home_controller');
router.get('/',homeController.api_home);
module.exports=router;