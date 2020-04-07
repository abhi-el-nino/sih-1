const uttarkhand = require('../models/UttarkhandModel');

module.exports.maps = (req, res) => {
    return res.render('maps', {
        title: 'Maps | Production'
    });
}


module.exports.getData = async (req, res) => {
    let districts = await uttarkhand.find({ Crop: req.query.crop }).sort({ Production: -1 }).exec();
    return res.json(200, {
        data: districts
    })
}

module.exports.markers = async (req, res) => {
    let districts = await uttarkhand.distinct('District_Name');
    let cordinateArray = new Array;
    for(let i of districts){
        let district = await uttarkhand.findOne({ District_Name: i });
        let data = {
            District: i,
            Latitude: district.Latitude,
            Longitude: district.Longitude
        }
        cordinateArray.push(data);
    }      
    return res.json(200, cordinateArray);
}

module.exports.chart = async (req, res) => {
    let cropData = await uttarkhand.find({ District_Name: req.query.District, Crop_Year: 2014 }).sort({ Production: -1 }).exec();
    let labels = new Array;
    let productionData = new Array;
    let areaData = new Array;
    let production14Data = new Array;
    let count = 0;
    cropData.forEach((crop) => {
        if (crop.Crop === "Total foodgrain" || crop.Crop === "Pulses total") { return; }
        if (labels.find(x => x === crop.Crop)) { return; }
        labels.push(crop.Crop);
        if (crop.Production == null) { productionData.push(0); }
        else { productionData.push(crop.Production); }
        if (count < 5) { production14Data.push(crop.Production); }
        if (count < 5) { areaData.push(crop.Area) };
        count++;
    })
    let year13Data = await uttarkhand.find({ District_Name: req.query.District, Crop_Year: 2013 }).sort({ Production: -1 }).exec();
    let production13Data = [];
    let year13labels = [];
    count = 0;
    year13Data.forEach((crop) => {
        if (crop.Crop === "Total foodgrain" || crop.Crop === "Pulses total") { return; }
        if (year13labels.find(x => x === crop.Crop)) { return; }
        if (count > 4) { return; }
        year13labels.push(crop.Crop);
        if (crop.Production == null) { production13Data.push(0); }
        else { production13Data.push(crop.Production); }
        count++;
    })
    return res.json(200, {
        pie: {
            labels: labels,
            productionData: productionData,
        },
        radar: {
            labels: year13labels,
            production13Data: production13Data,
            production14Data: production14Data
        },
        bar: {
            labels: year13labels,
            areaData: areaData
        }
    })
}