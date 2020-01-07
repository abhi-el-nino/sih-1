module.exports.home=(req,res)=>{
    return res.render('index',{
        title:'SIH | Home'
    });
}


module.exports.contact=(req,res)=>{
    return res.render('contact',{
        title:'SIH | Contact'
    });
}
module.exports.shoppingCart=(req,res)=>{
    return res.render('shopping-cart',{
        title:'SIH | Shopping Cart'
    });
}

