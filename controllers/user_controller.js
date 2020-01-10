const User = require('../models/User');
module.exports.register = (req, res) => {
    if (req.isAuthenticated()) {

        res.redirect('/users/profile');
    }
    return res.render('register', {
        title: "register"
    });
}
module.exports.createUser = async (req, res) => {
    try {
        
        if (req.body.password != req.body.confirm_password) {
            return res.redirect('back');
        }
        let user = await User.findOne({
            emailOrPhone: req.body.emailOrPhone
        });

        if (!user) {
            let newuser = await User.create({
                name: req.body.name,
                emailOrPhone: req.body.emailOrPhone,
                password: req.body.password
            });
            if(req.body.userType=="Farmer"){
                newuser.isFarmer=true;
                newuser.isBuyer=false;
               await newuser.save();
            }else{
                newUser.isFarmer=false;
                newuser.isBuyer=true;
                await newuser.save();

            }
            return res.redirect('/users/login')
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
    return res.render('login', {
        title: "login"
    });
}
module.exports.create_session = (req, res) => {
    return res.redirect('/');
}
module.exports.destroySession = function (req, res) {
    req.logout();
    return res.redirect('/');
}