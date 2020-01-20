const mongoose=require('mongoose');
const OrderSchema=new mongoose.Schema({
    items:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'
        }
    ],
    buyer:{
        type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
    },
    price:{
        type:Number
    },
    transaction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"transactions"
    }
});
const Orders=mongoose.model('Orders',OrderSchema);
module.exports=Orders;