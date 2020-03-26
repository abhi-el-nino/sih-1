const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path')
const AVATAR_PATH = path.join('/uploads/users/avatars');
const userSchema = new mongoose.Schema({

    emailOrPhone: {
        type: String,
        unique: true,
        required:true
    },
   
    password: {
        type: String,
        required: true,

    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: String
    },
    isFarmer: {
        type: Boolean
    },
    isBuyer: {
        type: Boolean
    },
    isAdmin: {
        type: Boolean
    },
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Items'
        }
    ],
    orders:[
        {
            type: mongoose.Schema.Types.ObjectId,
                ref: 'Order'
        }
    ]
}, {
    timestamps: true
});
//for ensuring that password is not show in api request
userSchema.methods.toJSON = function () {
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
userSchema.statics.uploadedAvatar = multer({ storage: storage }).single('avatar');
userSchema.statics.avatarPath = AVATAR_PATH;

const Users = mongoose.model('Users', userSchema);
module.exports = Users;