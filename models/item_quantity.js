const mongoose = require('mongoose');
const QuantSchema = new mongoose.Schema({
    item:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    } ,
    quantity: {
        type: Number
    },

});
const Quantity = mongoose.model('Quantity', QuantSchema);
module.exports = Quantity;