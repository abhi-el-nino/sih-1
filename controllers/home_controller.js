const Message = require('../models/message');
const Item = require('../models/item');
const Sms = require('../models/sms');
const User = require('../models/User');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const OTP=require('../models/Otp');

module.exports.home=(req,res)=>{
	return res.render('index',{
		layout:"mainLayout"
	})
}

module.exports.ecommerce = async (req, res) => {
	var items = await Item.find({});
	let filtered = items.filter((item,index)=>{
		return (item.image != null)
	});
	return res.render('ecommerce-index', {
		title: 'SIH | Home',
		items: filtered,
		active:'home'
	});
}


module.exports.fetchMessages = async (req, res) => {
	try {
		let messages = await Message.find({
			$or: [
				{ $and: [{ sender: req.user._id }, { receiver: req.params.id }] },
				{ $and: [{ sender: req.params._id }, { receiver: req.user._id }] }
			]
		});
		return res.json()
	} catch (err) {

	}
}
module.exports.upload_form = (req, res) => {
	return res.render('_item-upload', {
		title: "upload"
	});
}


module.exports.contact = (req, res) => {
	return res.render('contact', {
		title: 'SIH | Contact'
	});
}

module.exports.sms = async (req, res) => {
	let name = req.body.firstname + " " + req.body.lastname;
	let newSms = await Sms.create({
		content: req.body.content,
		senderNumber: req.body.sender,
		senderName: name
	});
	return;
}
module.exports.showSms = async (req, res) => {
	let sms = await Sms.find({});
	if (sms) {
		return res.json(200, {
			message: "item Successfully uploaded",
			data: {
				sms: sms
			}
		});
	}
}

module.exports.allOrders = async (req,res)=>{
	orders = await Order.find({buyer:req.user.id}).populate({
		path:'orderQuantity',
		populate:{
			path:'item'
		}
	})
	items_list=[]
	for (order in orders){
		items = orders[order].orderQuantity
		for (item in items){
			currItem = items[item]
			items_list.push({
				name : currItem.item.title,
				price :currItem.item.price,
				image: currItem.item.image,
				quantity : currItem.quantity
			})
		}
	}
	return res.render('order_profile',{
		items : items_list
	});
}
