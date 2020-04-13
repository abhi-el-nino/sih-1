const User = require('../models/User');
const {google} =require('googleapis');
const oauth2Client = new google.auth.OAuth2(
    "897366205304-4fl4vppb2l7hco1ov61t5fgc5239p1am.apps.googleusercontent.com",
    "QMujDlu1ZlnlEVpk0j9Ug0-_",
    "http://localhost:8000/users/auth/google/callback"
  );
  const scopes = [
      'email',
      'profile',
    'https://www.googleapis.com/auth/user.phonenumbers.read'
  ];
  const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',
  
    // If you only need one scope you can pass it as a string
    scope: scopes
  });
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
module.exports.create_session = (req, res) => {
    // console.log("qq",req.query.code);
    return res.redirect('/');
}
module.exports.destroySession = function (req, res) {
    req.logout();
    return res.redirect('/');
}