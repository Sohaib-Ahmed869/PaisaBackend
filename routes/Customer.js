const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const middleware = require('../middleware/middleware.js');
const Customer = require('../models/Customer.js');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

app.use(middleware); // This will be used for all the routes in this file

mongoose.connect('mongodb://0.0.0.0:27017/paisa', {
    useNewUrlParser: true,
});

const PORT = process.env.PORT || 3000;

app.post('/customers', async (req, res) => {
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

app.get('/customers', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/customers/:customerId', async (req, res) => {
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

app.patch('/customers/:customerId', async (req, res) => {
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

app.delete('/customers/:customerId', async (req, res) => {
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});