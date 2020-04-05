const mongoose = require('mongoose');
const dataSchema = new mongoose.Schema({
    State_Name: {
        type: String
    },
    District_name: {
        type: String
    },
    Crop_Year: {
        type: String
    },
    Season: {
        type: String
    },
    Crop: {
        type: String
    },
    Area: {
        type: String
    },
    Production: {
        type: Number
    },
    Latitude: {
        type: String
    },
    Longitude: {
        type: String
    }
});
const uttarkhand = mongoose.model('uttarkhand', dataSchema);
module.exports = uttarkhand;