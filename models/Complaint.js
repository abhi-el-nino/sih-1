const mongoose = require('mongoose');
const ComplaintSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        require:true
    },
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farmers',
        require:true
    },
    crop: {
        type: String,
        require:true
    },
    category: {
        type: String,
        require:true
    },
    content:{
        type:String,
        require:true
    }
}, {
    timestamps: true
});
const Cart = mongoose.model('Complaints', ComplaintSchema);
module.exports = Cart;