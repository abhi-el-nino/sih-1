const Message=require('../models/message');
const User=require('../models/User');
const Order=require('../models/Order');
const Item=require('../models/item');

module.exports.home=async (req,res)=>{

   try{
	let items=await Item.find({});
	return res.render('index',{
		title:'SIH | Home',
		items:items
    });
   }catch(err){

   }
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
module.exports.shoppingCart=async (req,res)=>{
	// var cartItems=[];
	// User.findById(req.user._id,function(err,user){
	// 	if(err){
	// 		console.log(err);
	// 	}else{
	// 		(user.cart).forEach(function(item){
	// 			Item.findById(item,function(err,founditem){
	// 				if(err){
	// 					console.log(err);
	// 				}else{
	// 					cartItems.push(founditem);
	// 				}
	// 			});
	// 		});
	// 		console.log(cartItems);
    // return res.render('shopping-cart',{
    //     title:'SIH | Shopping Cart',
	// 	cartItems:cartItems
    // });
	// 	}
	// });
	
	try {
		let user=await User.findById(req.user._id)
		.populate('cart');
		return res.render('shopping-cart',{
			title:"SIH | Cart",
			cartItems:user.cart
		});

	} catch (e) {
	console.log(e);
	return;
	}

}
module.exports.buyProduct=async (req,res)=>{
	try{
		
let item=await Item.findById(req.params.id);
return res.render("buy-product",{
	title:"SIH | Buy",
	product:item
});

	}catch(err){
		conssole.log(err);
		return;
	}
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
module.exports.upload_form=(req,res)=>{
	return res.render('_item-upload',{
		title:"upload"
	});
}
