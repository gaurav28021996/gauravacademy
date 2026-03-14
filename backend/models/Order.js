const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    student: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 },
        priceAtPurchase: { type: Number } // Security: prevents price changes from affecting old orders
    }],
    totalAmount: { type: Number, required: true },
    paymentStatus: { 
        type: String, 
        enum: ['Pending', 'Success', 'Failed'], 
        default: 'Pending' 
    },
    paymentGatewayId: { type: String }, // Razorpay/Stripe ID
    orderDate: { type: Date, default: Date.now },
    deliveryType: { type: String, enum: ['Download', 'Shipping'] }
});

module.exports = mongoose.model('Order', OrderSchema);
