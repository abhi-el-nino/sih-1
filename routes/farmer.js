const express=require('express');
const router=express.Router();
const Item = require('../models/item'); 
router.get('/', async function(req,res){
   let item =await Item.find({});
    return res.render('farmer_dashBoard',{
        items:item
    });
});

module.exports=router;