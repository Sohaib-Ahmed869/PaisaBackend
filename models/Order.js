const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    products: [{
        type: String,
        required: true
    }],
    sizes: [{
        type: String
    }],
    price: {
        type: Number,
        required: true
    },
    feedback: {
        type: String
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    seller_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true
    },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;