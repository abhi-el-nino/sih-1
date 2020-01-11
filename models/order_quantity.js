const mongoose = require('mongoose');
const QuantSchema = new mongoose.Schema({
    item:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    }
    ,
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    quantity: {
        type: Number
    },

});
const Quantity = mongoose.model('Quantity', QuantSchema);
module.exports = Quantity;