const uttarkhand = require('../models/UttarkhandModel');

module.exports.maps = (req, res) => {
    return res.render('maps', {
        title: 'Maps | Production'
    });
}


module.exports.getData = async (req, res) => {
    let districts = await uttarkhand.find({Crop:req.query.crop}).sort({Production:-1}).exec();
    return res.json(200,{
        data: districts
    })
}