var express = require('express'),
    router = express.Router(),
    stripe = require('stripe')('sk_test_eWQQ4UsI4UMyEwGpT1e9uJfj00udOO6ZRo'),
    bodyParser = require('body-parser'),
    Transaction = require('../models/transaction'),
    Order       = require('../models/Order'),
    Cart        = require('../models/Cart'),
    block       = require('../blockchain/index'),
    endPoint = 'whsec_TmSun6kNPvQBremNO6mWRFkZJZcmjDeD';
// paymentMailer = require('../../../mailer/attendeePayment');



router.get('/pay/:orderId', async function (req, res) {

    try {
        let order = await Order.findById(req.params.orderId);
        session = await stripe.checkout.sessions.create({
            customer_email: req.user.emailOrPhone,
            payment_method_types: ['card'],
            line_items: [
                {
                    name: `Buyfreash Payment Gateway`,
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
    let order = await Order.findById(req.query.orderId);
    let transaction = await Transaction.create({
        order:req.query.orderId,
        sessionId:req.query.session_id,
        paidAmount:order.amount
    });
    await Cart.deleteOne({buyer:req.user._id});
    order.completed=true;
    await order.save();
    var newblock={
        sessionId:req.query.session_id,
        amount:order.amount
    }
    block.newTransaction(newblock);
    return  res.render('success', { sessionId: req.query.session_id });
});



// router.post('/webhook', bodyParser.raw({type: 'application/json'}), function(req, res){
// 	const sig = req.headers['stripe-signature'];
// 	let event;

// 	try{
// 		event = stripe.webhooks.constructEvent(req.body, sig, endPoint);
// 	}
// 	catch(err){
// 		console.log('Webhook Error -> ' + err.message);
// 		return res.status(400).send(`Webhook Error: ${err.message}`);
// 	}

// 	//Handle the checkout.session.completed event
// 	if(event.type === 'checkout.session.completed' && event.data.object.metadata.checkWebhook == 'Attendee'){
// 		const session = event.data.object;

// 		//UPDATE THE TABLE FOR PAYMENT OF THE USER
// 		var sql = "INSERT INTO conf_attendee (paymentId, paymentDone, email, paymentType) VALUES(?, ?, ?, ?)";
// 		var values = [session.id, 1, session.customer_email, session.metadata.type];
// 		con.query(sql, values, function(err, result){
// 			if(err){
// 				throw err;
// 			}
// 			var data = {
// 				sessionId: session.id,
// 				type: session.metadata.type,
// 				amount: (session.display_items[0].amount)/100
// 			}
// 			paymentMailer.mail(data, session.customer_email);
// 		});
// 	}

// 	//Return a response to acknowledge receipt of the event
// 	res.json({received: true});
// });



module.exports = router;