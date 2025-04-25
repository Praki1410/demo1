const Product = require('../model/productModel');
const { validateProduct } = require('../utils/validation');
const fs = require('fs');
const path = require('path');

// exports.createProduct = async (req, res) => {
//   try {
//     // Validate request body
//     const { error } = validateProduct(req.body);
//     if (error) {
//       return res.status(400).json({ message: error.details[0].message });
//     }
    
//     if (!req.file) {
//       return res.status(400).json({ message: 'Product image is required' });
//     }
    
//     const { name, price } = req.body;
//     const image = req.file.path;
//     const user_id = req.user.id;
    
//     // Create product
//     const productId = await Product.create({
//       user_id,
//       name,
//       price,
//       image
//     });
    
//     const product = await Product.findById(productId);
    
//     res.status(201).json({
//       message: 'Product created successfully',
//       product
//     });
//   } catch (error) {
//     console.error('Create product error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };



exports.createProduct = async (req, res) => {
  try {
    // Validate request body
    const { error } = validateProduct(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Product images are required' });
    }
    
    const { name, price } = req.body;
    const images = req.files.map(file => file.path);
    const user_id = req.user.id;
  
    const productId = await Product.create({
      user_id,
      name,
      price,
      image: JSON.stringify(images) 
    });
    
    const product = await Product.findById(productId);
    
    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.json({ products });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    const products = await Product.findByUserId(userId);
    res.json({ products });
  } catch (error) {
    console.error('Get user products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id;
    
    // Check if product exists and belongs to user
    const isOwner = await Product.isOwner(productId, userId);
    if (!isOwner) {
      return res.status(403).json({ message: 'Unauthorized to update this product' });
    }
    
    // Get current product to get current image path
    const currentProduct = await Product.findById(productId);
    if (!currentProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Validate request body
    const { error } = validateProduct(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    
    const { name, price } = req.body;
    let image = currentProduct.image;
    
    // If new image is uploaded
    if (req.file) {
      // Delete old image
      if (fs.existsSync(currentProduct.image)) {
        fs.unlinkSync(currentProduct.image);
      }
      image = req.file.path;
    }
    
    // Update product
    const updated = await Product.update(productId, {
      name,
      price,
      image
    });
    
    if (!updated) {
      return res.status(400).json({ message: 'Failed to update product' });
    }
    
    const updatedProduct = await Product.findById(productId);
    
    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id;
    
    // Check if product exists and belongs to user
    const isOwner = await Product.isOwner(productId, userId);
    if (!isOwner) {
      return res.status(403).json({ message: 'Unauthorized to delete this product' });
    }
    
    // Get product to delete image
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Delete product image
    if (fs.existsSync(product.image)) {
      fs.unlinkSync(product.image);
    }
    
    // Delete product
    const deleted = await Product.delete(productId);
    
    if (!deleted) {
      return res.status(400).json({ message: 'Failed to delete product' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};