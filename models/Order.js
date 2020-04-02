const mongoose=require('mongoose');
const OrderSchema=new mongoose.Schema({
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
    },
    completed:{
        type:Boolean,
        default:false
    },
    transactionId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    }
},{
    timestamps:true
});
const Orders=mongoose.model('Orders',OrderSchema);
module.exports=Orders;