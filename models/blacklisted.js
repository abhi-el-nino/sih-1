const mongoose = require('mongoose');
const blacklistedSchema = new mongoose.Schema({
    farmer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    crop:{
        type:String,
        required:true
    },

    category:{
        type:String,
        required:true
    }
},{
    timestamps:true
});
const Blacklisted = mongoose.model('Blacklisted', blacklistedSchema);
module.exports = Blacklisted;