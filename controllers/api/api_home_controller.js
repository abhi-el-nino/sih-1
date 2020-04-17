const request = require('async-request');
const Item = require('../../models/item');
const User=require('../../models/User');
const jwt = require('jsonwebtoken');
const OTP=require('../../models/Otp');
module.exports.api_home = (req, res) => {
    return res.json(200, {
        message: "hii"
    });
}
module.exports.whetherReport = async (req, res) => {
    try {
        console.log(req.query);
        let options = {
            method: 'GET',
        }

        let response = await request(`http://api.openweathermap.org/data/2.5/weather?lat=${req.query.lat}&lon=${req.query.lon}&appid=be50af9722a691e8eeb67031b90caaa3`, options);

        return res.json(200, {
            message: "whether",
            data: {
                data: JSON.parse(response.body).main
            }
        });
    } catch (e) {
        console.log(e);
    }

}
module.exports.getAllPRoducts = async (req, res) => {
    try {
       let farmer=await User.find({emailOrPhone:req.params.id})
        let items = await Item.find({ farmer: farmer._id });
        return res.json(200,{
            message: "All products for the requsting farmer",
            data: {
                items: items
            }
        });
    } catch (e) {
        console.log(e);
        return res.json(500,{
            message: "internal server error"
        });
    }

}
module.exports.addProduct = (req, res) => {

    Items.uploadedImage(req, res, async function (err) {
    try {
        console.log("here");
        if (err) {
            console.log("multer error", err);
            return;
        }
        if (!req.file) {
            console.log("image not uploaded");
            return;
        } else {
            let Options = {
                method: "GET"
            };
            let mlResponse = await request(URI, options);

            newItem.price = mlResponse.price;
            let newItem = await Items.create({
                title: mlResponse.name,
                farmer: req.user._id,
                price: mlResponse.price,
                description: mlResponse.description
            });
            newItem.image = `${Items.imagePath}/${req.file.filename}`;


            (await newItem).save();

            return res.json({
                status : 200,
                id : newItem._id,
                message: "item Successfully uploaded",
                data: {
                    item: newItem
                }
            });
        }


    } catch (error) {
        console.log(error);
        return res.json(500,{
            message: "internal server error"
        });
    }
    });

}
module.exports.updateProduct = async (req, res) => {
    try {
        let item = await Item.findById(req.body.itemId);
        // if (req.user != item.farmer) {
        //     return res.json(404,{
        //         message: "UNAUTHORIZED"
        //     });
        // }

        item = await Item.findByIdAndUpdate({
            title: req.body.name,
            price: req.body.price,
            description: req.body.descripton
        });
        return res.json({
            status : 200,
            message: "updated successfully",
            data: {
                item: item
            }
        });
    } catch (e) {
        console.log(e);
        return res.json(500,{
            message: "internal server error"
        });
    }
}
module.exports.createUser = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {

            console.log(req.body);

        let user = await User.findOne({
            emailOrPhone: req.body.phone
        });

        if (!user) {
            let newuser = await User.create({
                name: req.body.name,
                emailOrPhone: req.body.phone,
                password: req.body.password
            });
            // if (req.body.userType == "Farmer") {
            //     newuser.isFarmer = true;
            //     newuser.isBuyer = false;
            //     await newuser.save();
            // } else {
            //     newUser.isFarmer = false;
            //     newuser.isBuyer = true;
            //     await newuser.save();

            // }
            return res.json(201,{
            message:"Registered Successfully",
            status:201
            });
        } else {
            return res.json(202,{
                message:"already exists",
                status:202
            });
        }


    } catch (err) {
        console.log(err);
        return res.json(500,{
            message:"internal server error"
        });
    }

}


module.exports.createSession = async function (req, res) {
    try {
        console.log(req.body)
        
        let user = await User.findOne({ phone:req.body.phone});
   
        if (!user) {
            return res.json(200, {
                message: 'invalid username or password',
                exists:false
            });

        } else {

            function generateOTP() {

                
                var digits = '0123456789';
                let OTP = '';
                for (let i = 0; i < 4; i++) {
                    OTP += digits[Math.floor(Math.random() * 10)];
                }
                return OTP;
            }
            const otp = generateOTP();
            await OTP.create({
                user:user._id,
                otp:otp
            });

            return res.json(200, {
                message: 'signed in successfully',
                exists:true,
                data: {
                    otp_id:user._id
                }
            });
        }
    } catch (err) {
        console.log("error in authentication",err);

    }

}
module.exports.submitOtp= async (req,res)=>{
    try {
        let obj=await OTP.findOne({user:req.body.user});
        let user=await User.findById(req.body.user);
        
        let submittedOtp=`req.body.otp`;
        if(obj && obj.otp==submittedOtp){
         return res.status(200).json({
             message:"correct",
             correctOTP:true,
             data:{
                token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: 100000 }),
                 first_name : user.first_name,
                 last_name:user.last_name
             }
         });
        }else{
            return res.status(200).json({
                message:"incorrect",
                correctOTP:false,
               
            });
        }
    } catch (error) {
        
    }
       
    }