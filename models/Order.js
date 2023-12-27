const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
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
    orderStatus: {
        type: Boolean,
        default: false
    },
    orderDate: { type: Date, required: true },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
