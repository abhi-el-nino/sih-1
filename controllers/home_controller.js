const Message = require('../models/message');
const Item = require('../models/item');
const Sms = require('../models/sms');
const User = require('../models/User');
const Cart = require('../models/Cart');
module.exports.home = async (req, res) => {
	var items = await Item.find({});

	// if (req.user) {
	// 	let cart = await Cart.findOne({ buyer: req.user._id });
	// 	let cartItems = cart.items;

	// 	let populatedCart = await Promise.all(cartItems.map(async (item) => {
	// 		let foundItem = await Item.findById(item.item);
	// 		return ({
	// 			item: foundItem,
	// 			quantity: item.quantity
	// 		})
	// 	}));

	// 	// console.log("ppp",populatedCart);

	// 	return res.render('index', {
	// 		title: 'SIH | Home',
	// 		items: items,
	// 		cart:populatedCart
	// 	});

	// }



	return res.render('index', {
		title: 'SIH | Home',
		items: items
	});
}

module.exports.maps = (req, res) => {
	return res.render('maps', {
		title: 'Maps | Production'
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
