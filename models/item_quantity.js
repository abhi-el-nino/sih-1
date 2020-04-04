const mongoose = require('mongoose');
const QuantSchema = new mongoose.Schema({
    item:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Items'
    } ,
    quantity: {
        type: Number
    },
    cart:{
        type: String
    }
});
const Quantity = mongoose.model('Quantity', QuantSchema);
module.exports = Quantity;