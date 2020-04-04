const Users = require('../models/User');
const Item = require('../models/item');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const OrderQuantity = require('../models/item_quantity');

module.exports.toggleCart = async (req, res) => {
    try {
        let cart = await Cart.findOneAndUpdate({ buyer: req.user._id });
        let item = await Item.findById(req.body.itemId);
        if (cart == null) {
            let amount = parseInt(item.price) * parseInt(req.body.quantity);
            let newCart = await Cart.create(
                {
                    buyer: req.user._id,
                    amount: amount
                }
            );
            let item_quantity = await OrderQuantity.create({
                item: req.body.itemId,
                quantity: req.body.quantity,
                cart: newCart._id
            });
            newCart.orderQuantity.push(item_quantity._id);
            await newCart.save();
            return res.status(200).json({
                data: {
                    added: true
                }, message: "item added and new cart created"
            });

        } else {
            let amount = cart.amount;
            amount += (parseInt(item.price) * parseInt(req.body.quantity));
            cart.amount = amount;
            await cart.save();
            let itemExisted = await OrderQuantity.findOne({ cart: cart.id, item: req.body.itemId }).exec();
            if (itemExisted) {
                itemExisted.quantity = parseInt(itemExisted.quantity) + parseInt(req.body.quantity);
                await itemExisted.save()
                return res.status(200).json({
                    data: {
                        added: false
                        , message: "item added to cart and cart existed"
                    }
                });
            } else {
                let item_quantity = await OrderQuantity.create({
                    item: req.body.itemId,
                    quantity: req.body.quantity,
                    cart: cart._id
                });
                await cart.orderQuantity.push(item_quantity._id);
                await cart.save();

                return res.status(200).json({
                    data: {
                        added: true
                        , message: "item added to cart and cart existed"
                    }
                });
            }
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
        console.log("errrrrrrrrr", err);
        return;
    }
}

module.exports.transactionFailed = function (req, res) {
    return res.redirect('/');
}

module.exports.removeFromCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ buyer: req.user._id });
        console.log(req.params.itemId);
        let item = await OrderQuantity.findOneAndDelete({ cart: cart._id, item: req.params.itemId }).populate('item').exec();
        cart.orderQuantity.pull(item._id);
        cart.amount = cart.amount - ((item.item.price) * item.quantity);
        await cart.save();
        return res.status(200).json({
            message: "removed from cart",
            amount: cart.amount
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "internaal server error"
        });
    }
}

module.exports.getItems = async (req, res) => {
    try {
        let cart = await Cart.findOne({ buyer: req.user._id }).populate({
            path: 'orderQuantity',
            populate: {
                path: 'item'
            }
        }).exec();
        return res.json(200, {
            cart: cart,
            cartItems: cart.orderQuantity
        });

    } catch (e) {
        console.log(e);
        return;
    }
}