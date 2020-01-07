module.exports.register = function(req, res) {
    if (req.isAuthenticated()) {

        res.redirect('/users/profile');
    }
    return res.render('register', {
        title: "register"
    });
}
module.exports.login = function(req, res) {

    if (req.isAuthenticated()) {

        return res.redirect('/users/profile')
    }
    return res.render('login', {
        title: "login"
    });
}
module.exports.create_session=(req,res)=>{
    return res.redirect('/');
}
module.exports.destroySession = function(req, res) {
    req.logout();
    return res.redirect('/');
}