const Users = require('../models/User');
const Item = require('../models/item');
const Cart = require('../models/Cart');
const Order = require('../models/Order');

module.exports.toggleCart = async (req, res) => {
    try {

        let cart = await Cart.findOne({ buyer: req.user._id });
        let item = await Item.findById(req.body.itemId);
        
        if (!cart) {
            let amount = item.price;
            let newCart =await Cart.create(
                {
                    buyer: req.user._id,
                    amount: amount
                }
            );
            newCart.items.push(req.body.itemId);
            await newCart.save();
            return res.status(200).json({
                data: {
                    added: false
                }, message: "item removed"
            });

        } else {
            let amount = cart.amount;
            amount += item.price;
            cart.amount = amount;
            await cart.items.push(req.body.itemId);
            await cart.save();
            return res.status(200).json({
                data: {
                    added: true
                }, message: "item added to cart"
            });
        }
    } catch (err) {
        console.log(err);
        return res.json(500, {
            data: {
                message: "internal server error"
            }
        });
    }
}

module.exports.checkout = async (req, res) => {
   let cart = await Cart.findOne({buyer:req.user._id}).populate('items').exec();
   if(cart){
        let order = await Order.create({
            items:cart.items,
            buyer:req.user._id,
            amount:cart.amount
        });
        return res.redirect(`/order/payment/${order._id}`);
   }
}


module.exports.shoppingCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({buyer:req.user._id}).populate('items').exec();
        return res.render('shopping-cart', {
            title: "SIH | Cart",
            cartItems: cart.items
        });

    } catch (e) {
        console.log(e);
        return;
    }

}
module.exports.buyProduct = async (req, res) => {
    try {

        let item = await Item.findById(req.params.id);
        return res.render("buy-product", {
            title: "SIH | Buy",
            product: item
        });

    } catch (err) {
        console.log(err);
        return;
    }
}

module.exports.transactionFailed=function(req,res){
    return res.redirect('/');
}
