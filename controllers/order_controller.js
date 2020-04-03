const Users = require('../models/User');
const Item = require('../models/item');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const OrderQuantity = require('../models/item_quantity');

module.exports.toggleCart = async (req, res) => {
    try {
        // console.log('rrrrrrrrrrr',req.body);
        let cart = await Cart.findOne({ buyer: req.user._id });
        let item = await Item.findById(req.body.itemId);
        console.log("mycart",cart);
        if (cart==null) {
            let amount = item.price * parseInt(req.body.quantity);
            let newCart = await Cart.create(
                {
                    buyer: req.user._id,
                    amount: amount
                }
            );
            const newItem = {
                item: req.body.itemId,
                quantity: req.body.quantity
            }
            newCart.items.push(newItem);
            await newCart.save();
            return res.status(200).json({
                data: {
                    added: false
                }, message: "item added and existed"
            });

        } else {
            let amount = cart.amount;
            amount += item.price * parseInt(req.body.quantity);
            cart.amount = amount;
            let found = false;
            console.log("kk",cart.items);
            for (let item of cart.items) {
                if (item.item._id == req.body.itemId) {
                   
                    found = true;
                    item.quantity = item.quantity + parseInt(req.body.quantity);
                }
            }
            console.log('found',found);
            if (found === false){
                await cart.items.push({ item: req.body.itemId, quantity: req.body.quantity });
            }
            await cart.save();
            return res.status(200).json({
                data: {
                    added: true
                }, message: "item added to cart and doesn't existed"
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
    let updatedCart=(cart.items).filter((item)=>{

        console.log(item.item._id==req.params.id);
        if(item.item._id==req.params.id){
            return false;
        }else{
            return true
        }


    });
    
    await Cart.findByIdAndUpdate(cart._id,{
        items:updatedCart
    });
    await cart.save();
    let newCart = await Cart.findOne({ buyer: req.user._id });
    console.log("upp",newCart.items)

    return res.status(200).json({
        message:"removed from cart"
    });
   } catch (error) {
       console.log(error);
    return res.status(500).json({
        message:"internaal server error"
    }); 
   }



}
