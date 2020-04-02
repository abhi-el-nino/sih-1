const Users = require('../models/User');
const Item = require('../models/item');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const OrderQuantity = require('../models/item_quantity');

module.exports.toggleCart = async (req, res) => {
    try {

        let cart = await Cart.findOne({ buyer: req.user._id });
        let item = await Item.findById(req.body.itemId);

        if (!cart) {
            let amount = item.price * (req.body.quantity);
            let newCart = await Cart.create(
                {
                    buyer: req.user._id,
                    amount: amount
                }
            );
            let orderQuantity = await OrderQuantity.create(
                {
                    item: req.body.itemId,
                    quantity: req.body.quantity
                }
            );
            newCart.orderQuantity.push(orderQuantity._id);
            await newCart.save();
            return res.status(200).json({
                data: {
                    added: false
                }, message: "item removed"
            });

        } else {
            let amount = cart.amount;
            amount += item.price * (req.body.quantity);
            cart.amount = amount;
            let orderQuantity = await OrderQuantity.create(
                {
                    item: req.body.itemId,
                    quantity: req.body.quantity
                }
            )
            await cart.items.push(orderQuantity._id);
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
    let cart = await Cart.findOne({ buyer: req.user._id }).exec();
    if (cart) {
        let order = await Order.create({
            items: cart.items,
            buyer: req.user._id,
            amount: cart.amount
        });
        return res.redirect(`/order/payment/pay/${order._id}`);
    }
}


module.exports.shoppingCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ buyer: req.user._id }).populate('items').exec();
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

module.exports.transactionFailed = function (req, res) {
    return res.redirect('/');
}
