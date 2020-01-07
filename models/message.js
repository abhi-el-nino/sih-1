const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }


}, {
    timestamps: true
});
const Message = mongoose.model('Message', messageSchema);
module.exports = Message;


