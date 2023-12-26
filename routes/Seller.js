const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const Product = require('../models/Product');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Seller = require('../models/Seller');
const { verifySellerToken } = require('../middleware/VerifySellerToken');

//-----------------------------PRODUCT--------------------------------------------

// add product
router.post('/addProduct', async (req, res) => {
    try {
        const { name, price, description, category, stock} = req.body;

        const token = req.header('Authorization');
        const decoded = jwt.verify(token, 'your_secret_key');
        const sellerId = decoded.id;


        const newProduct = {
            prod_code: name + sellerId,
            name,
            price,
            description,
            category,
            qty: stock,
            seller_id: sellerId,
        };

        const product = new Product(newProduct);

        // Save the product to the database
        await product.save();

        res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
        console.log(error);
    }
}
);

// add image to product
router.post('/addImageToProduct', async (req, res) => {
    const file = req.files.file;
    const fileName = file.name;
    const uploadPath = path.join(__dirname, '../public/images', fileName);
    const dbPath = '/images/' + fileName;

    try {
        file.mv(uploadPath, async (error) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Error uploading image' });
            }

            // Get the product name from the request body
            const { name } = req.body;

            // Find the product by name
            const product = await Product.findOne({ name: name });

            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            // Add the image path to the product
            product.images.push(dbPath);

            // Save the product to the database
            await product.save();

            res.status(201).json({ message: 'Image uploaded successfully' });
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
);

// delete image from product
router.delete('/deleteImageFromProduct', async (req, res) => {
    try {
        const { name, image } = req.body;

        // Find the product by name
        const product = await Product.findOne({ name: name });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Delete the image from the server
        const imagePath = path.join(__dirname, '../public', image);
        fs.unlinkSync(imagePath);

        // Remove the image path from the product
        product.images = product.images.filter((img) => img !== image);

        // Save the product to the database
        await product.save();

        res.status(201).json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
);

// update product


// deactivate product
router.put('/deactivateProduct', async (req, res) => {
    try{
        const { name } = req.body;

        const product = Product.find({ name: name });

        if (product) {
            product.active = false;

            await product.save();
        }

        res.status(201).json({ message: 'Product deactivated successfully' });
    } catch (error) {
        console.log(error);

    }
}
);

// activate product
router.put('/activateProduct', async (req, res) => {
    try{
        const { name } = req.body;

        const product = Product.find({ name: name });

        if (product) {
            product.active = true;

            await product.save();
        }

        res.status(201).json({ message: 'Product activated successfully' });
    } catch (error) {
        console.log(error);

    }
}
);

// view all products
router.get('/viewAllProductsForSeller', async (req, res) => {
    try {
        const token = req.header('Authorization');
        const decoded = jwt.verify(token, 'your_secret_key');
        const sellerId = decoded.id;

        const products = await Product.find({ seller_id: sellerId });

        res.status(200).json({ products });
    } catch (error) {
        console.log(error);
    }
}
);

// view one product
router.get('/viewProduct', verifySellerToken, async (req, res) => {
    try {
        const { name } = req.body;

        const product = Product.findOne({ name: name });

        res.status(200).json({ product });

    } catch (error) {
        console.log(error);

    }
}
);

// update quantity
router.put('/updateQuantity', async (req, res) => {
    try {
        const { name, quantity } = req.body;

        const token = req.header('Authorization');
        const decoded = jwt.verify(token, 'your_secret_key');
        const sellerId = decoded.id;
        // Find the product by name
        const product = Product.findOne({ name: name , seller_id: sellerId});

        if(!product){
            res.status(400).json({ message: 'Product not found' });
        }

        if (product) {
            product.qty = quantity;

            await product.save();
        }

        res.status(201).json({ message: 'Quantity updated successfully' });

    } catch (error) {
        console.log(error);
    }
}
);

// put discount
router.put('/putDiscount', async (req, res) => {
    try {
        const { name, discount } = req.body;

        const token = req.header('Authorization');
        const decoded = jwt.verify(token, 'your_secret_key');
        const sellerId = decoded.id;


        // Find the product by name
        const product = Product.findOne({ name: name , seller_id: sellerId});

        if(!product){
            res.status(400).json({ message: 'Product not found' });
        }
        if (product) {
            product.discount = discount;

            await product.save();
        }

        res.status(201).json({ message: 'Discount updated successfully' });

    } catch (error) {
        console.log(error);
    }
}
);

// -----------------------------ORDER--------------------------------------------

// view all orders
router.get('/viewAllOrders',verifySellerToken, async (req, res) => {
    try {
        const token = req.header('Authorization');
        const decoded = jwt.verify(token, 'your_secret_key');
        const sellerId = decoded.id;

        const orders = await Order.find({ seller_id: sellerId });

        res.status(200).json({ orders });
    } catch (error) {
        console.log(error);
    }
}
);

// view one order
router.get('/viewOrder',verifySellerToken, async (req, res) => {
    try {
        const { id } = req.body;

        const order = Order.findOne({ _id: id });

        res.status(200).json({ order });

    } catch (error) {
        console.log(error);

    }
}
);

// update order status
router.put('/updateOrderStatus',verifySellerToken, async (req, res) => {
    try {
        const { id, status } = req.body;

        const token = req.header('Authorization');
        const decoded = jwt.verify(token, 'your_secret_key');
        const sellerId = decoded.id;

        // Find the order by id
        const order = Order.findOne({ _id: id , seller_id: sellerId});

        if(!order){
            res.status(400).json({ message: 'Order not found' });
        }

        if (order) {
            order.status = status;

            await order.save();
        }

        res.status(201).json({ message: 'Order status updated successfully' });

    } catch (error) {
        console.log(error);
    }
}
);

// -----------------------------PAYMENT--------------------------------------------
// view all payments
router.get('/viewAllPayments',verifySellerToken, async (req, res) => {
    try {
        const token = req.header('Authorization');
        const decoded = jwt.verify(token, 'your_secret_key');
        const sellerId = decoded.id;

        const payments = await Payment.find({ seller_id: sellerId });

        res.status(200).json({ payments });
    } catch (error) {
        console.log(error);
    }
}
);

// -----------------------------PROFILE--------------------------------------------

// view profile
router.get('/viewProfile',verifySellerToken, async (req, res) => {
    try {
        const token = req.header('Authorization');
        const decoded = jwt.verify(token, 'your_secret_key');
        const sellerId = decoded.id;

        const seller = await Seller.findOne({ _id: sellerId });

        res.status(200).json({ seller });
    } catch (error) {
        console.log(error);
    }
}
);

// update profile
router.put('/updateProfile',verifySellerToken, async (req, res) => {
    try {
        const { name, email, password, dob, address, contact } = req.body;

        const token = req.header('Authorization');
        const decoded = jwt.verify(token, 'your_secret_key');
        const sellerId = decoded.id;

        const seller = await Seller.findOne({ _id: sellerId });

        if (seller) {
            seller.name = name;
            seller.email = email;
            seller.password = password;
            seller.dob = dob;
            seller.address = address;
            seller.contact = contact;

            await seller.save();
        }

        res.status(201).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.log(error);
    }
}
);

module.exports = router;