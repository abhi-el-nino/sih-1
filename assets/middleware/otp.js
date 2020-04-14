const axios=require('axios');
const OTP=require('../../models/Otp');
module.exports.sendOtp=async (req,res,next)=>{

    const obj= await OTP.findOne({
      user:req.user._id
    });
    const otp=obj.otp;
    const phone=req.user.phone;
    axios.get(`https://api.textlocal.in/send/?apiKey=9vAkgLw23+M-W42nfAuLIxvHE1dkEhr8kjtx8FQ9EV&sender=TXTLCL&numbers=${phone}&message= Your OTP for Buyfresh Login: ${otp}`)
  .then(response => {
    next();
   
  })
  .catch(error => {
    console.log(error);
    next();
  });
    // const number=parseInt(req.body.phone)
   
}