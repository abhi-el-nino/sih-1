const uttarkhand = require('../models/UttarkhandModel');

module.exports.maps = (req, res) => {
    return res.render('maps', {
        title: 'Maps | Production'
    });
}


module.exports.fetchCrop = async (req, res) => {
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    let giveCount=(topDistricts)=>{
        let sol_arr=[];
        for(let i=0;i<topDistricts.length;i++){
            if(i==0){
                sol_arr.push({
                    lat:topDistricts[0].Latitude,
                    lng:topDistricts[0].Longitude,
                    count:20
                });
                continue;
            }

            let m=(sol_arr[i-1].count/topDistricts[i-1].Production);
            let y=m*topDistricts[i].Production;
                y=Math.round(y);
                if(sol_arr[i-1].count-y>3){
                    
                    y=sol_arr[i-1].count-3;
                    // console.log(y);
                }
                sol_arr.push({
                    lat:topDistricts[i].Latitude,
                    lng:topDistricts[i].Longitude,
                    count:y
                });
        }
        return sol_arr;
    }
    let districts = await uttarkhand.find({
        Crop: capitalizeFirstLetter(req.body.crop),
        Crop_Year: '2014',
        Season: 'Whole Year'

    }).sort({Production:-1}).exec();

    if(districts.length==0){
        districts= await uttarkhand.find({
            Crop: capitalizeFirstLetter(req.body.crop),
            Crop_Year: '2014',
            
    
        }).sort({Production:-1}).exec();
    }

    let topDistricts=districts.slice(1,11);
    // console.log(topDistricts);
    let newArr=giveCount(topDistricts);
    // console.log("body", newArr);

    return res.status(200).json({
        data: {
            mapData:newArr
        },
        message: "working"
    });

}