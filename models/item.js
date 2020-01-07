const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path')
const AVATAR_PATH = path.join('/uploads/items/avatars');
const itemSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,

    },
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },

    avatar: {
        type: String
    },
    price: {
        type: Number
    },
    discount: {
        type: Number
    }


}, {
    timestamps: true
});
//for ensuring that password is not show in api request
itemSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.password;
    return obj;
}
let storage = multer.diskStorage({
    destination: function (req, file, cb) {

        cb(null, path.join(__dirname, '..', AVATAR_PATH));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
itemSchema.statics.uploadedAvatar = multer({ storage: storage }).single('avatar');
itemSchema.statics.avatarPath = AVATAR_PATH;

const Items = mongoose.model('Items', itemSchema);
module.exports = Items;