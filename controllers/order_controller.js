const Users = require('../models/User');
const Item = require('../models/item');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const OrderQuantity = require('../models/item_quantity');
const pricePredictor = require('../utilitis/pricePredictor');

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
            amount = (parseInt(item.price) * parseInt(req.body.quantity));
            cart.amount = amount;
            await cart.save();
            let itemExisted = await OrderQuantity.findOne({ cart: cart.id, item: req.body.itemId }).exec();
            if (itemExisted) {
                itemExisted.quantity = parseInt(req.body.quantity);
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

module.exports.paymentProcedure = async (req, res) => {
    let cart = await Cart.findOne({ buyer: req.user._id }).exec();
    if (cart) {
        let order = await Order.create({
            orderQuantity: cart.orderQuantity,
            buyer: req.user._id,
            amount: cart.amount,
            delivery: cart.delivery
        });
        return res.redirect(`/order/payment/pay?orderId=${order._id}&deliveryCost=${price.deliveryAmount}`);
    }
}


module.exports.shoppingCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ buyer: req.user._id }).populate({
            path: 'orderQuantity',
            populate: {
                path: 'item'
            }
        }).exec();
        let price = await pricePredictor(req, cart._id);
        cart.deliveryAmount = price.deliveryAmount;
        await cart.save();
        return res.render('shopping-cart', {
            title: "SIH | Cart",
            cartItems: cart.orderQuantity,
            amount: cart.amount,
            deliveryAmount: price.deliveryAmount,
            total: cart.amount + price.deliveryAmount
        });

    } catch (e) {
        console.log(e);
        return;
    }

}
module.exports.buyProduct = async (req, res) => {
    try {

        let item = await Item.findById(req.params.id);
        let cart = await Cart.findOne({ buyer: req.user._id });
        if (cart) {
            let item_quantity = await OrderQuantity.findOne({ cart: cart._id, item: req.params.id });
            if (item_quantity) {
                return res.render("buy-product", {
                    title: "SIH | Buy",
                    product: item,
                    quantity: item_quantity.quantity
                });
            } else {
                return res.render("buy-product", {
                    title: "SIH | Buy",
                    product: item,
                    quantity: 0
                })
            }
        } else {
            return res.render("buy-product", {
                title: "SIH | Buy",
                product: item,
                quantity: 0
            });
        }
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
        if (cart) {
            return res.json(200, {
                cart: cart,
                cartItems: cart.orderQuantity
            });
        }
    } catch (e) {
        console.log(e);
        return;
    }
}