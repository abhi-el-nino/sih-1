module.exports.home=(req,res)=>{
    return res.render('index',{
        title:'SIH | Home'
    });
}

module.exports.register=(req,res)=>{
    return res.render('register',{
        title:'SIH | Home'
    });
}