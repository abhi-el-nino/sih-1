const Item = require('../models/item');
const Cart = require('../models/Cart');
const OrderQuantity = require('../models/item_quantity');
const pricePredictor = require('../utilitis/pricePredictor');
const Category = require('../models/Category');
const Complaint = require('../models/Complaint');
const Feedback = require('../models/Feedback');
const Order = require('../models/Order');
const mongoose = require('mongoose')

module.exports.toggleCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ buyer: req.user._id });
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
                    added: 1
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
                        added: cart.orderQuantity.length
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
                        added: cart.orderQuantity.length
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
        return res.redirect(`/order/payment/pay?orderId=${cart._id}&deliveryCost=${cart.delivery}`);
    } else {
        req.flash('Add some itmes to cart')
        return res.redirect('back')
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
        await Cart.update({ buyer: req.user._id }, { $set: { "delivery": price.deliveryAmount } })

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
        if (req.params.id != "undefined") {
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
        } else {
            return res.redirect('/')
        }
    } catch (err) {
        console.log(err);
        return;
    }
}

module.exports.transactionFailed = function (req, res) {
    req.flash('error', 'Transaction Failed')
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
            deleted: cart.orderQuantity.length,
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

module.exports.getSellers = async (req, res) => {
    let sellers = await Category.findOne({ name: req.query.category }).populate({ path: 'items', match: { quality: req.query.quality },populate:{path:'farmer',select:'name _id avatar'}})
    return res.status(200).json({
        sellers: sellers
    })
}

module.exports.feedback = async (req,res)=>{
    let feedback = await Feedback.create({
        item:req.params.id,
        content : req.body.content,
        rating : req.body.rating,
        buyer:req.user.id
    })

    if(feedback.rating < 3){
        let item = await Item.findById(mongoose.Types.ObjectId(req.params.id))
        await Complaint.create({buyer:req.user.id,farmer:item.farmer,content:feedback.content,rating:feedback.rating,item:item._id,category:item.category,crop:item.title});
        req.flash('success','Due to low rating of the item we have filed a complaint');
        return res.redirect('back');
    }else{
    req.flash('success','Your Feedback Has Been Recorded')
    return res.redirect('back')
    }
}

module.exports.getComments= async(req,res)=>{
    let comments = await Feedback.find({ item: mongoose.Types.ObjectId(req.params.id) }).populate({path:'buyer',select:'first_name avatar'})
    return res.status(200).json({
        comments:comments
    })
}