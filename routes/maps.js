const express=require('express');
const router=express.Router();
const mapController= require('../controllers/map_controller');

router.get('/', mapController.maps);
router.post('/fetch-heatmap-data/crop',mapController.fetchCrop);
module.exports=router;