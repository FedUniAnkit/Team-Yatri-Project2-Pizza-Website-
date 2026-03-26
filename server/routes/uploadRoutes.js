const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const path = require('path');
const fs = require('fs');
const { Product } = require('../models');

// Simple auth middleware for now
const protect = (req, res, next) => {
  // For testing, just pass through
  // In production, verify JWT token
  next();
};

// Basic request logger for this router
router.use((req, res, next) => {
  console.log(`[UPLOAD_ROUTER] ${req.method} ${req.originalUrl} CT=${req.headers['content-type']}`);
  next();
});

// Simple ping route to verify mounting
router.get('/ping', (req, res) => {
  res.json({ success: true, message: 'upload router ok' });
});

// Upload single image
router.post('/image', protect, upload.single('image'), async (req, res) => {
  try {
    console.log('=== UPLOAD REQUEST RECEIVED ===');
    console.log('Upload endpoint hit');
    console.log('File received:', req.file);
    console.log('Body keys:', Object.keys(req.body || {}));
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Form data fields:', req.body);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    
    if (!req.file) {
      console.log('❌ No file received. Debugging info:');
      console.log('req.body:', req.body);
      console.log('req.files:', req.files);
      console.log('req.file:', req.file);
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
        debug: {
          hasFile: !!req.file,
          bodyKeys: Object.keys(req.body || {}),
          contentType: req.headers['content-type'],
          multerError: req.fileValidationError || 'No multer error'
        }
      });
    }

    // Return relative URL path for the uploaded file
    // Frontend will use this with the proxy configuration
    const imageUrl = `/uploads/${req.file.filename}`;
    
    console.log('File uploaded successfully:', imageUrl);
    
    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url: imageUrl
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
});

// Delete uploaded image
router.delete('/image/:filename', protect, async (req, res) => {
  try {
    const { filename } = req.params;
    const filepath = path.join(__dirname, '../uploads', filename);
    
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      res.status(200).json({
        success: true,
        message: 'Image deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message
    });
  }
});

// Debug: create a tiny test image file and return its URL
router.post('/debug/create-test-image', async (req, res) => {
  try {
    const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAADUlEQVQoU2NkYGD4z0AEYBxqAQD2bJt3m5zA7QAAAABJRU5ErkJggg==';
    const buffer = Buffer.from(pngBase64, 'base64');
    const filename = `test-${Date.now()}.png`;
    const filePath = path.join(__dirname, '../uploads', filename);
    fs.writeFileSync(filePath, buffer);

    const host = req.get('host');
    const protocol = (req.headers['x-forwarded-proto'] || req.protocol || 'http');
    const baseUrl = `${protocol}://${host}`;
    const imageUrl = `${baseUrl}/uploads/${filename}`;

    console.log('Debug test image created at:', imageUrl);
    res.status(200).json({ success: true, url: imageUrl, filename });
  } catch (err) {
    console.error('Debug create test image error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Debug: set a product's image by ID to a given URL (development only)
router.post('/debug/set-product-image', async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ success: false, message: 'Not allowed in production' });
    }

    const { id, url } = req.body || {};
    if (!id || !url) {
      return res.status(400).json({ success: false, message: 'id and url are required' });
    }

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.image = url;
    await product.save();
    res.json({ success: true, message: 'Product image updated', id, url });
  } catch (err) {
    console.error('Debug set product image error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
