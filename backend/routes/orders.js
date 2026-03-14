const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth'); // Ensure you have this middleware

// Place an Order
router.post('/checkout', auth, async (req, res) => {
    try {
        const { products, totalAmount, paymentGatewayId } = req.body;
        
        const newOrder = new Order({
            student: req.user.id,
            products,
            totalAmount,
            paymentGatewayId,
            paymentStatus: 'Success' // In real apps, verify this with Razorpay webhook
        });

        const order = await newOrder.save();
        res.json({ msg: 'Order placed successfully', order });
    } catch (err) { res.status(500).send('Server Error'); }
});

// Get User's Order History/Downloads
router.get('/my-orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ student: req.user.id }).populate('products.product');
        res.json(orders);
    } catch (err) { res.status(500).send('Server Error'); }
});

module.exports = router;
