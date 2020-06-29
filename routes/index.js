const express=require('express');
const router=express.Router();
const passport=require('passport');
const homeController=require('../controllers/home_controller');
const itemController=require('../controllers/items_controller');
router.get('/ecommerce',homeController.ecommerce);
router.get('/contact',homeController.contact);
router.use('/api',require('./api'));
router.post('/upload-item',passport.checkAuthentication,itemController.upload);
router.use('/users',require('./user'));
router.post('/sms',homeController.sms);
router.get('/sms',homeController.showSms)
router.use('/farmer',require('./farmer.js'));
router.use('/maps',require('./maps'));
router.use('/order',passport.checkAuthentication,require('./order'));
router.get('/pastOrders',passport.checkAuthentication,homeController.allOrders)
router.get('/',homeController.home);
router.post("/search", async (req, res) => {
    console.log(req.body);
  
    let keywords = req.body.query.split(" ");
    console.log(keywords);
  
    let categories = "premiumeliteclassic"
    if(keywords.length < 2){
  
      let value = keywords[0];
  
      let pattern = new RegExp(value,'i');
  
      if(categories.match(pattern)){
          let items = await Items.find({
            
              category: pattern
            }).populate('farmer');
            return res.render('search_results',{
                items:items
            })
  
      }else{
  
          let items = await Items.find({
            
              title: pattern
            }).populate('farmer');
            return res.render('search_results',{
              items:items
          })
      }
  
    }else{
  let firstP = new RegExp(keywords[0],'i');
  let secondP = new RegExp(keywords[1],'i');
  
      let categoryP = categories.match(firstP) ? firstP:secondP;
     let  itemP = categories.match(firstP) ? secondP:firstP;
     let items = await Items.find({
      title: itemP,
      category: categoryP,
    }).populate('farmer');
    return res.render('search_results',{
      items:items
  })
    }
  });
module.exports=router;