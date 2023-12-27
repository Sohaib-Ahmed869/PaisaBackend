const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const Category = require('../models/Categories');

router.post('/addCategory', async (req, res) => {
    try {
        const { name } = req.body;
        const category = new Category({
            name
        });
        await category.save();
        res.status(201).json({ message: 'Category added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}
);

router.get('/getCategories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ categories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}
);

router.get('/getCategory/:name', async (req, res) => {
    try {
        const category = await Category.findOne({ name: req.params.name });
        res.status(200).json({ category });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}
);


module.exports = router;