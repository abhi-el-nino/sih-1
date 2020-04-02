var express = require('express'),
    router = express.Router(),
    stripe = require('stripe')('sk_test_eWQQ4UsI4UMyEwGpT1e9uJfj00udOO6ZRo'),
    bodyParser = require('body-parser'),
    Transaction = require('../models/transaction'),
    Order = require('../models/Order'),
    Cart = require('../models/Cart'),
    block = require('../blockchain/index'),
    generatePdf = require('../utilitis/pdfGenerator'),
    mailer = require('../mailer/payment');

router.get('/pay/:orderId', async function (req, res) {

    try {
        let order = await Order.findById(req.params.orderId);
        session = await stripe.checkout.sessions.create({
            customer_email: req.user.email,
            payment_method_types: ['card'],
            line_items: [
                {
                    name: `Buyfresh Payment Gateway`,
                    quantity: 1,
                    currency: 'inr',
                    description: '(Inclusive of 2% transaction charges)',
                    images: ['https://drive.google.com/uc?id=1pi0meQST2sfriYUafHR-Iy1ycwqXDXFk'],
                    amount: [Math.ceil(order.amount / 98)] * 100
                    // Keep the amount on the server to prevent customers from manipulating
                }
            ],
            metadata: {
                type: req.params.type,
                // checkWebhook: 'Attendee'
            },
            // session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
            success_url: `http://localhost:8000/order/payment/success?session_id={CHECKOUT_SESSION_ID}&orderId=${req.params.orderId}`,
            cancel_url: `http://localhost:8000/order/transactionFailed?orderId=${req.params.orderId}`
        });
        return res.render('pay', {
            title: 'Payment',
            sessionId: session.id
        });
    }
    catch (err) {
        console.log(err);
    }

});



router.get('/success', async function (req, res) {
    let order = await Order.findById(req.query.orderId).populate('buyer').populate({
        path: 'orderQuanitity',
        populate: {
            path: 'item',
            select: ['title', 'description', 'price', 'discount']
        }
    }
    ).exec();
    let receiptNumber = Math.random() * 100000;
    receiptNumber = receiptNumber.toFixed(0);
    let transaction = await Transaction.create({
        order: req.query.orderId,
        sessionId: req.query.session_id,
        paidAmount: order.amount,
        receiptNumber: receiptNumber
    });
    await Cart.deleteOne({ buyer: req.user._id });
    order.completed = true;
    await order.save();
    var newblock = {
        sessionId: req.query.session_id,
        amount: order.amount
    }
    block.newTransaction(newblock);
    const invoice = {
        shipping: {
            name: order.buyer.firstName + order.buyer.lastName,
            address: order.buyer.address,
            city: "Dehdradune",
            state: "UK",
            country: "INDIA",
            postal_code: 244001
        },
        items: order.orderQuantity,
        subtotal: order.amount,
        paid: order.amount,
        invoice_nr: receiptNumber
    };
    generatePdf(invoice);
    var data = {
        sessionId: req.query.session_id,
        amount: order.amount
    }
    mailer.mail(data, order.buyer.email);
    return res.render('success', { sessionId: 'req.query.session_id' });
});

module.exports = router;