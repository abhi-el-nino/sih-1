<<<<<<< HEAD
const mongoose=require('mongoose');
const CartSchema=new mongoose.Schema({
    items:[
      {
          item:  {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Items'
        },
        quantity:{
            type:Number
=======
const mongoose = require('mongoose');
const CartSchema = new mongoose.Schema({
    orderQuantity: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quantity',
            required: true
>>>>>>> ffd43c037b90b90505c9c9d4125110d858794e43
        }
      }
    ],
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    amount: {
        type: Number
    }
}, {
    timestamps: true
});
const Cart = mongoose.model('cart', CartSchema);
module.exports = Cart;