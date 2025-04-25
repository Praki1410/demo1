exports.formatProduct = (product) => {
    if (!product) return null;
    
    return {
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.image,
      created_at: product.created_at
    };
  };
  
  exports.errorHandler = (err, req, res, next) => {
    console.error(err);
    
    if (err.name === 'MulterError') {
      return res.status(400).json({ message: `File upload error: ${err.message}` });
    }
    
    res.status(500).json({ message: 'Server error' });
  };
  