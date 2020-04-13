module.exports=function(lat1,long1,lat2,long2){

    lat1 = toRadians(lat1); 
    long1 = toRadians(long1); 
    lat2 = toRadians(lat2); 
    long2 = toRadians(long2); 

    let dlong = long2 - long1; 
    let dlat = lat2 - lat1; 

    let ans = Math.pow(Math.sin(dlat / 2), 2) +  
    Math.cos(lat1) * Math.cos(lat2) *  
    Math.pow(Math.sin(dlong / 2), 2);

    ans = 2 * Math.asin(Math.sqrt(ans)); 
    
    let radius = 6371;
    return ans*radius;
}

function toRadians(degree){
    let oneDegree= (Math.PI/180);
    return oneDegree*degree;
}