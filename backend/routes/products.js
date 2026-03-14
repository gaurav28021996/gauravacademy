const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products or filter by category/exam
router.get('/', async (req, res) => {
    try {
        const { category, examType, classLevel } = req.query;
        let query = {};
        if (category) query.category = category;
        if (examType) query.examType = examType;
        if (classLevel) query.classLevel = classLevel;

        const products = await Product.find(query);
        res.json(products);
    } catch (err) { res.status(500).send('Server Error'); }
});

// Get single product details
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.json(product);
    } catch (err) { res.status(404).json({ msg: 'Product not found' }); }
});

module.exports = router;
