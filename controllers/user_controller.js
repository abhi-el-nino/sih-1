const User = require('../models/User');
const OTP=require('../models/Otp');

module.exports.register = (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/');
    }
    return res.render('register', {
        title: "register"
    });
}
module.exports.createUser = async (req, res) => {
    try {
        console.log("creation",req.body);
        if (req.body.password != req.body.confirm_password) {
            return res.redirect('back');
        }
        let user = await User.findOne({
            email: req.body.email
        });

        if (!user) {
            let newuser = await User.create({
                first_name: req.body.firstName,
                last_name: req.body.lastName,
                email: req.body.email,
                phone:req.body.phone,
                password: req.body.password,
                address: req.body.address,
                role: req.body.userType

            });
            req.login(newuser, function (err) {
                if (err) { 
                    console.log(err);
                    return next(err); }
                return res.redirect('/users/login')
            });

        } else {
            return res.redirect('back');
        }


    } catch (err) {
        console.log(err);
        return;
    }

}
module.exports.login = (req, res) => {

    if (req.isAuthenticated()) {

        return res.redirect('/');
    }
    return res.render('login', {layout:"loginLayout"});
}
module.exports.submitOtp= async (req,res)=>{
try {
    let obj=await OTP.findOne({user:req.user._id});
  
    
    let submittedOtp=`${req.body.first}${req.body.second}${req.body.third}${req.body.fourth}`;
    if(obj && obj.otp==submittedOtp){
     return res.redirect('/');
    }else{
        return res.redirect('back');
    }
} catch (error) {
    
}
   
}
module.exports.loginWithOtp=(req,res)=>{
    
    if (req.isAuthenticated()) {

        return res.redirect('/');
    }
    return res.render('otp_login', {layout:"loginLayout"});
}
module.exports.create_session = (req, res) => {
    console.log(req.body);
    // console.log("qq",req.query.code);
    return res.redirect('/');
}
module.exports.destroySession = async function (req, res) {
await OTP.deleteMany({
    user:req.user._id
});

    req.logout();
    return res.redirect('/');
}