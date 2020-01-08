const Items = require('../models/item');
module.exports.upload = (req, res) => {
    if (req.user.isFarmer == true) {

        Items.uploadedImage(req, res, async function (err) {

            try {
                if (err) {
                    console.log("multer error");
                    return;
                }
                if(!req.file){
                    console.log("image not uploaded");
                    return;
                }else{
                    let newItem=await Items.create({
                        title:req.body.item_name,
                        farmer:req.user._id,
                        price:req.body.price
                    });
                    newItem.image=`${Items.imagePath}/${req.file.filename}`;
                    (await newItem).save();

                    if (req.xhr) {
                        console.log("uploading via ajax")
                        return res.status(200).json({
                            data: {
                                item:newItem
                            },
                            message: "Item Uploaded!"
                        });

                    }
                    return res.redirect('back');
                }
               

            } catch (error) {
                console.log(error);
                return;
            }
        });
    }
}