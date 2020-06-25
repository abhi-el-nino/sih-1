const distanceCalculator = require('./distanceCalculator');
const Cart = require('../models/Cart');
const Uttarkhand = require('../models/UttarkhandModel')
const axios = require('axios');
const PricePerKilometer = [10, 15, 25];
module.exports = async function (req, orderId) {
    return new Promise(async function (resolve, reject) {
        try {
            var citiesCovered = new Array;
            let orderPlaced = await Cart.findById(orderId).populate({
                path: 'orderQuantity',
                populate: {
                    path: 'item',
                    populate: {
                        path: 'farmer'
                    }
                }
            });
            let deliveryAmount = 0;
            var ordersArray = orderPlaced.orderQuantity;
            for (order in ordersArray) {
                let buyerCoordinates = await axios.get(`https://atlas.mapmyindia.com/api/places/geocode?address=${req.user.address}`, {
                    headers: {
                        Authorization: process.env.MAP_API
                    }
                });
                let farmerDistrict = await Uttarkhand.findOne({ District_Name: ordersArray[order].item.farmer.address });
                if (!citiesCovered.includes(ordersArray[order].item.farmer.address)) {
                    let distance = distanceCalculator(buyerCoordinates.data.copResults.latitude, buyerCoordinates.data.copResults.longitude, farmerDistrict.Latitude, farmerDistrict.Longitude);
                    let data = {
                        distance: distance,
                        quantity: ordersArray[order].quantity
                    }
                    citiesCovered[`${ordersArray[order].item.farmer.address}`] = data;
                } else {
                    let data = citiesCovered[ordersArray[order].item.farmer.address];
                    let newQuantity = data.quantity + ordersArray[order].quantity;
                    data.quantity = newQuantity;
                    citiesCovered[`${ordersArray[order].item.farmer.address}`] = data;
                }
            }
            for (city in citiesCovered) {
                let truck = -1;
                if (citiesCovered[city].quantity <= 50) { truck = 0 }
                else if (citiesCovered[city].quantity > 50 && citiesCovered[city].quantity < 100) {
                    truck = 1;
                } else {
                    truck = 2;
                }
                deliveryAmount += (citiesCovered[city].distance * PricePerKilometer[truck]);
            }
            let amount = {
                deliveryAmount: Math.ceil(deliveryAmount),
                itemTotal: orderPlaced.amount
            }
            resolve(amount);
        } catch (err) {
            console.log(err);
            reject(new Error('Cannot Predict The Price'));
        }
    })
}