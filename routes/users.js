const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Customer = require('./models/customer');  // Import the Customer model
const Admin = require('./models/admin');        // Import the Admin model
const SuperAdmin = require('./models/superadmin');// Import the SuperAdmin model
const Seller = require('./models/seller');      // Import the Seller model

// Common signup route for Admin, SuperAdmin, and Seller
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, dob } = req.body;
        // You can add additional validation if needed

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Choose the appropriate model based on the user type
        const userType = req.body.userType; // Assuming you have a userType field in the request body
        let User;

        switch (userType) {
            case 'admin':
                User = Admin;
                break;
            case 'superadmin':
                User = SuperAdmin;
                break;
            case 'seller':
                User = Seller;
                break;
            default:
                return res.status(400).json({ error: 'Invalid user type' });
        }

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            dob,
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Customer signup route
router.post('/signup/customer', async (req, res) => {
    try {
        const { name, email, password, dob, addresses, paymentMethods } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new customer
        const newCustomer = new Customer({
            name,
            email,
            password: hashedPassword,
            dob,
            addresses,
            paymentMethods,
        });

        // Save the customer to the database
        await newCustomer.save();

        res.status(201).json({ message: 'Customer registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Common signin route for Admin, SuperAdmin, and Seller
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Choose the appropriate model based on the user type
        const userType = req.body.userType; // Assuming you have a userType field in the request body
        let User;

        switch (userType) {
            case 'admin':
                User = Admin;
                break;
            case 'superadmin':
                User = SuperAdmin;
                break;
            case 'seller':
                User = Seller;
                break;
            default:
                return res.status(400).json({ error: 'Invalid user type' });
        }

        // Find the user by email
        const user = await User.findOne({ email });

        // Check if the user exists
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id, userType }, 'your_secret_key');

        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Customer signin route
router.post('/signin/customer', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the customer by email
        const customer = await Customer.findOne({ email });

        // Check if the customer exists
        if (!customer) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, customer.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: customer._id, userType: 'customer' }, 'your_secret_key');

        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
