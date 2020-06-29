const express = require("express");
const router = express.Router();
const passport = require("passport");
const Item = require("../../models/item");
const homeController = require("../../controllers/api/api_home_controller");
const Items = require("../../models/item");
const { ObjectId } = require("mongoose").Types;
router.use("/mobile", require("./mobile"));
router.post("/submit-number", homeController.numberVerification);
router.post("/submit-otp", homeController.submitOtpfromAdmin);
router.get(
  "/check-session",
  passport.authenticate("jwt", { session: false }),
  homeController.checkSession
);
router.post(
  "/take-action",
  passport.authenticate("jwt", { session: false }),
  homeController.takeAction
);
router.post("/find", async (req, res) => {
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
module.exports = router;
