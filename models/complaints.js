const mongoose = require('mongoose');
const complaintsSchema = new mongoose.Schema({
    farmer:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    item:{
        type:String,
        required:true
    },

    category:{
        type:String,
        required:true
    },
    complaints:[
        {
            type:String,
            required:true
        }
    ]
},{
    timetamps:true
});

const Complaints = mongoose.model('Complaints', complaintsSchema);
module.exports = Complaints;