module.exports.changeCenter=(req,res)=>{
    if(req.xhr){
        console.log("changing map center");
        return res.status(200).json({
            message:"changed center"
        });
    }
}