const Message=require('../models/message');
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
module.exports.fetchMessages=async (req,res)=>{
try{
    let messages=await Message.find({
        $or: [
            { $and : [ { sender:req.user._id }, { receiver:req.params.id } ] },
            { $and : [ { sender:req.params._id }, { receiver:req.user._id} ] }
        ]
    });
    return res.json()
}catch(err){

}
}
