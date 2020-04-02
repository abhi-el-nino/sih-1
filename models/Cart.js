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
        }
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