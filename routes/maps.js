const express=require('express');
const router=express.Router();
const mapController= require('../controllers/map_controller');

router.get('/', mapController.maps);
router.get('/getData',mapController.getData);
module.exports=router;