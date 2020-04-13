const distanceCalculator = require('./distanceCalculator');
const Order = require('../models/Order');
const Uttarkhand = require('../models/UttarkhandModel')
const axios = require('axios');
const PricePerKilometer = [50, 75, 100];
module.exports = async function (orderId) {
    new Promise(function (resolve, reject) {
        try {
            let citiesCovered = new Array;
            let order = await Order.findById(orderId).populate({
                path: 'orderQuantity',
                populate: {
                    path: 'item',
                    populate: {
                        path: 'user'
                    }
                }
            });
            let deliveryAmount = 0;
            order.orderQuantity.forEach(async (item) => {
                let buyerCoordinates = await axios.get();
                let farmerDistrict = await Uttarkhand.findOne({ District_Name: item.user.address });
                if (!citiesCovered.includes(item.user.address)) {
                    let distance = distanceCalculator(buyerCoordinates.data.cropResult.Latitude, buyerCoordinates.data.cropResult.Longitude, farmerDistrict.Latitude, farmerDistrict.Longitude);
                    let data = {
                        distance: distance,
                        quantity: item.quantity
                    }
                    citiesCovered[`${item.user.address}`] = data;
                } else {
                    let data = citiesCovered[item.user.address];
                    let newQuantity = data.quantity + item.quantity;
                    data.quantity = newQuantity;
                    citiesCovered[`${item.user.address}`] = data;
                }
            });
            citiesCovered.forEach((city) => {
                let truck = -1;
                if (city.quantity <= 50) { truck = 0 }
                else if (city.quantity > 50 && city.quantity < 100) {
                    truck = 1;
                } else {
                    truck = 2;
                }
                deliveryAmount += (distance * PricePerKilometer[truck]);
            })
            let amount = {
                deliveryAmount: deliveryAmount,
                itemTotal: order.amount
            }
            resolve(amount);
        } catch (err) {
            console.log(err);
            reject(new Error('Cannot Predict The Price'));
        }
    })
}