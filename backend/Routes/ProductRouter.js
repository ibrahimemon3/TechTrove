const router = require('express').Router();
const ensureAuthenticated = require('../Middlewares/Auth');
const ProductModel = require('../Models/Product');

// Create Product with Image
router.post('/', ensureAuthenticated, async (req, res) => {
    try {
        const { category, productName, price, brand, image, description } = req.body;  // Include description

        const product = new ProductModel({
            category,
            productName,
            price,
            brand,
            image, // Store the base64-encoded image
            description, // Save the description
        });

        await product.save();
        res.status(201).json({ message: 'Product created successfully', product });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', err });
    }
});

// Update Product with Image
router.put('/:id', ensureAuthenticated, async (req, res) => {
    try {
        const { category, productName, price, brand, image, description } = req.body; // Include description
        const product = await ProductModel.findByIdAndUpdate(
            req.params.id,
            { category, productName, price, brand, image, description },  // Update description
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', err });
    }
});

// Read Products
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const products = await ProductModel.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', err });
    }
});

// Delete Product
router.delete('/:id', ensureAuthenticated, async (req, res) => {
    try {
        const product = await ProductModel.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', err });
    }
});

// Add this in ProductRouter.js
router.get('/:id', ensureAuthenticated, async (req, res) => {
    try {
      const product = await ProductModel.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error', err });
    }
  });
  

module.exports = router;
