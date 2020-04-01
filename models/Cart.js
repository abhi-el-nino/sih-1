const mongoose=require('mongoose');
const CartSchema=new mongoose.Schema({
    items:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Items'
        }
    ],
    buyer:{
        type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
    },
    amount:{
        type:Number
    }
},{
    timestamps:true
});
const Cart=mongoose.model('cart',CartSchema);
module.exports=Cart;