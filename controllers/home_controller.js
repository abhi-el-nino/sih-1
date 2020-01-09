const Message=require('../models/message');
const User=require('../models/User');
const Order=require('../models/Order');
const Item=require('../models/item');
const products=[{
	name:"Potato",
	image:"//cdn.grofers.com/app/images/products/normal/pro_261115.jpg?ts=1576743641",
	description:"This is a potato",
	price:"$14.00"
},{
	name:"Onion",
	image:"//cdn.grofers.com/app/images/products/normal/pro_326691.jpg?ts=1576820709",
	description:"This is an onion",
	price:"$13.00"
},{
	name:"Apple",
	image:"//cdn.grofers.com/app/images/products/normal/pro_190325.jpg",
	description:"This is an apple",
	price:"$34.00"
},{
	name:"Cabbage",
	image:"//cdn.grofers.com/app/images/products/normal/pro_190311.jpg?ts=1576743640",
	description:"This is a cabbage",
	price:"$34.00"
}];
module.exports.home=(req,res)=>{
    return res.render('index',{
        title:'SIH | Home'
    });
}


module.exports.shop=(req,res) =>{
	User.findById(req.params.id,function(err,user){
		if(user){
			var item = Item.create({
				title:null,
				farmer:null,
				image:null,
				price:req.body.final-price,
				discount:0
			})
			 User.findById(user.order,function(err,order){
				if(order){
					order.items.push(item);
					order.save();
					// update total price
				}else{
				 order =  Order.create({
					items:[],
					buyer:req.params._id,
					price:req.body.final-price,
					transaction:null
				});
				order.items.push(item);
				order.save();
				 }
			 });
			 return res.status(200).json({
				data:{
					user:user
				},
				message:"order placed"
			});
	}})
	
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
module.exports.buyProduct=(req,res)=>{
	return res.render("buy-product",{
		title:"SIH | Buy",
		product:products[req.params.num]
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
