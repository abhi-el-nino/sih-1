const express=require('express');
const router=express.Router();
const mapController= require('../controllers/map_controller');

router.get('/', mapController.maps);
router.get('/getData',mapController.getData);
router.post('/chart',mapController.chart);
router.post('/fetch-heatmap-data/crop',mapController.fetchCrop);
module.exports=router;