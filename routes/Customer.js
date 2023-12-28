
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

router.post('/customers', async (req, res) => {
    try {
        const { name, email, password, dob, addresses, paymentMethods, block } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newCustomer = new Customer({
            name,
            email,
            password: hashedPassword,
            dob,
            addresses,
            paymentMethods,
            block,
        });
        await newCustomer.save();

        res.status(201).json({ message: 'Customer registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/customers', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/customers/:customerId', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.customerId);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/customers/:customerId', async (req, res) => {
    try {
        const allowedUpdates = ['name', 'password', 'email', 'dob', 'addresses', 'paymentMethods', 'block', 'favourites'];
        const updates = Object.keys(req.body);
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).json({ error: 'Invalid updates!' });
        }

        const customer = await Customer.findByIdAndUpdate(
            req.params.customerId,
            req.body,
            { new: true, runValidators: true }
        );

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        res.status(200).json(customer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/customers/:customerId', async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.customerId);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;