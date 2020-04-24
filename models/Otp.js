const mongoose=require('mongoose');
const OtpSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    },
   
    
    otp:{
        type:String,
        require:true
    },
    expireAt: {
        type: Date,
        default: Date.now,
        index: { expires: '5m' },
      },
},{
    timestamps:true
});
const OTP=mongoose.model('OTP',OtpSchema);
module.exports=OTP;