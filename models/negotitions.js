const mongoose=require('mongoose');
const negoSchema=new mongoose.Schema({
   farmer:{
    type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
   },
    buyer:{
        type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
    },
    
    status:{
        type:Number
    },
    item:{
        type: mongoose.Schema.Types.ObjectId,
            ref: 'Items'
    }
});
const Negotiations=mongoose.model('Negotiations',negoSchema);
module.exports=Negotiations;