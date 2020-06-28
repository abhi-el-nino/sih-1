const Items = require('../models/item');
const Users = require('../models/User');
const Category = require('../models/Category')

module.exports.upload = (req, res) => {
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
                    quality: req.body.quality,
                    quantity: req.body.quantity,
                    category: req.body.category
                });
                newItem.image = `${Items.imagePath}/${req.file.filename}`;
                await newItem.save();

                let category = await Category.findOne({ name: req.body.category })
                if (category) {
                    category.items.push(newItem._id)
                    await category.save()
                }
                else {
                    let newCategory = await Category.create({ name: req.body.category })
                    newCategory.items.push(newItem._id)
                    await newCategory.save()
                }

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
