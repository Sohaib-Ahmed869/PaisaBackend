
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const express = require('express');
const router = express.Router();

//place order
router.post('/placeorder', async (req, res) => {
    try {
        const { customer, products, sizes, price,seller_id,customerName } = req.body;
        const newOrder = new Order({
            customer,
            products,
            sizes,
            price,
            seller_id,
            customerName
        });
        await newOrder.save();
        return res.status(201).json({ message: 'Order placed successfully' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

//rate order
router.post('/rateorder', async (req, res) => {
    try {
        const { orderId, rating, feedback } = req.body;
        const order = await Order.findById(orderId);
        order.rating = rating;
        order.feedback = feedback;
        await order.save();
        return res.status(201).json({ message: 'Order rated successfully' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

//get orders
router.post('/getorders', async (req, res) => {
    try {
        const { customerId } = req.body;
        const orders = await Order.find({ customer: customerId });
        return res.status(201).json({ orders });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

//get order
router.post('/getorder', async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await Order.findById(orderId);
        return res.status(201).json({ order });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

//cancel order
router.put('/cancelorder', async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await Order.findById(orderId);
        order.status = 'Cancelled';
        await order.save();
        return res.status(201).json({ message: 'Order cancelled successfully' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;