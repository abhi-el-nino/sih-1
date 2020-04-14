const Items = require('../models/item');
const Users = require('../models/User');
module.exports.upload = (req, res) => {
    if (req.user._doc.role === "Farmer") {
        Items.uploadedImage(req, res, async function (err) {

            try {
                if (err) {
                    console.log("multer error", err);
                    return;
                }
                if (!req.file) {
                    console.log("image not uploaded");
                    return;
                } else {
                    let newItem = await Items.create({
                        title: req.body.item_name,
                        farmer: req.user._id,
                        price: req.body.price,
                        quality: 5,
                        quantity: req.body.quantity
                    });
                    newItem.image = `${Items.imagePath}/${req.file.filename}`;
                    await newItem.save();

                    if (req.xhr) {
                        console.log("uploading via ajax")
                        return res.status(200).json({
                            data: {
                                item: newItem
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
