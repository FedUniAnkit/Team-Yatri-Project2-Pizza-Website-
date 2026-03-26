const { Product, CustomizationOption } = require('../models');
const { Op } = require('sequelize');

// Helper function to transform product data
const transformProductData = (product) => {
  const productData = product.toJSON ? product.toJSON() : product;
  
  // Ensure price is a number
  if (productData.price) {
    productData.price = parseFloat(productData.price);
  }
  
  // Ensure sizes prices are numbers
  if (productData.sizes && Array.isArray(productData.sizes)) {
    productData.sizes = productData.sizes.map(size => ({
      ...size,
      price: parseFloat(size.price) || 0
    }));
  }
  
  return productData;
};

// @desc    Get all products with filtering, sorting, and search
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    const {
      category,
      subcategory,
      search,
      sort = 'name',
      order = 'ASC',
      dietary,
      maxPrice,
      spiceLevel,
      popular,
      new: isNew
    } = req.query;

    // Build where clause
    const whereClause = { isAvailable: true };

    // Category filter
    if (category) {
      whereClause.category = category;
    }

    // Subcategory filter
    if (subcategory) {
      whereClause.subcategory = subcategory;
    }

    // Search functionality
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { ingredients: { [Op.contains]: [search] } }
      ];
    }

    // Price filter
    if (maxPrice) {
      whereClause.price = { [Op.lte]: parseFloat(maxPrice) };
    }

    // Spice level filter
    if (spiceLevel) {
      whereClause.spiceLevel = { [Op.lte]: parseInt(spiceLevel) };
    }

    // Popular filter
    if (popular === 'true') {
      whereClause.isPopular = true;
    }

    // New items filter
    if (isNew === 'true') {
      whereClause.isNew = true;
    }

    // Dietary filters
    if (dietary) {
      const dietaryFilters = dietary.split(',');
      const dietaryConditions = [];
      
      dietaryFilters.forEach(filter => {
        switch (filter.toLowerCase()) {
          case 'veg':
          case 'vegetarian':
            dietaryConditions.push({ 'dietaryInfo.vegetarian': true });
            break;
          case 'vegan':
            dietaryConditions.push({ 'dietaryInfo.vegan': true });
            break;
          case 'gf':
          case 'gluten-free':
            dietaryConditions.push({ 'dietaryInfo.glutenFree': true });
            break;
          case 'halal':
            dietaryConditions.push({ 'dietaryInfo.halal': true });
            break;
          case 'spicy':
            dietaryConditions.push({ spiceLevel: { [Op.gte]: 3 } });
            break;
        }
      });

      if (dietaryConditions.length > 0) {
        whereClause[Op.and] = dietaryConditions;
      }
    }

    // Build order clause
    let orderClause;
    switch (sort) {
      case 'price_asc':
        orderClause = [['price', 'ASC']];
        break;
      case 'price_desc':
        orderClause = [['price', 'DESC']];
        break;
      case 'popular':
        orderClause = [['isPopular', 'DESC'], ['sortOrder', 'ASC'], ['name', 'ASC']];
        break;
      case 'new':
        orderClause = [['isNew', 'DESC'], ['createdAt', 'DESC']];
        break;
      case 'name':
      default:
        orderClause = [['sortOrder', 'ASC'], ['name', order.toUpperCase()]];
        break;
    }

    const products = await Product.findAll({
      where: whereClause,
      order: orderClause
    });

    // Transform product data to ensure proper data types
    const transformedProducts = products.map(transformProductData);

    res.status(200).json({ 
      success: true, 
      data: transformedProducts,
      count: products.length,
      filters: {
        category,
        subcategory,
        search,
        sort,
        dietary,
        maxPrice,
        spiceLevel,
        popular,
        new: isNew
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get a single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      res.status(200).json({ success: true, data: transformProductData(product) });
    } else {
      res.status(404).json({ success: false, message: 'Product not found.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};


// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin/Staff
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      category,
      subcategory,
      ingredients,
      allergens,
      sizes,
      dietaryInfo,
      spiceLevel,
      preparationTime,
      isPopular,
      isNew,
      isAvailable,
      sortOrder
    } = req.body;

    // Validation
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, price, and category are required'
      });
    }

    const productData = {
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      image: image || '/images/placeholder-food.jpg',
      category: category.trim(),
      subcategory: subcategory?.trim() || null,
      ingredients: Array.isArray(ingredients) ? ingredients : [],
      allergens: Array.isArray(allergens) ? allergens : [],
      sizes: Array.isArray(sizes) ? sizes : [],
      dietaryInfo: dietaryInfo || {},
      spiceLevel: parseInt(spiceLevel) || 0,
      preparationTime: parseInt(preparationTime) || 15,
      isPopular: Boolean(isPopular),
      isNew: Boolean(isNew),
      isAvailable: isAvailable !== false, // Default to true
      sortOrder: parseInt(sortOrder) || 0
    };

    const product = await Product.create(productData);
    res.status(201).json({ 
      success: true, 
      data: transformProductData(product),
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Failed to create product', 
      error: error.message 
    });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin/Staff
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      category,
      subcategory,
      ingredients,
      allergens,
      sizes,
      dietaryInfo,
      spiceLevel,
      preparationTime,
      isPopular,
      isNew,
      isAvailable,
      sortOrder
    } = req.body;

    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Update fields only if provided
    if (name !== undefined) product.name = name.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = parseFloat(price);
    if (image !== undefined) {
      product.image = image;
    }
    if (category !== undefined) {
      // Handle empty category by setting to 'uncategorized'
      const trimmedCategory = category.trim();
      product.category = trimmedCategory || 'uncategorized';
    }
    if (subcategory !== undefined) product.subcategory = subcategory?.trim() || null;
    if (ingredients !== undefined) product.ingredients = Array.isArray(ingredients) ? ingredients : [];
    if (allergens !== undefined) product.allergens = Array.isArray(allergens) ? allergens : [];
    if (sizes !== undefined) product.sizes = Array.isArray(sizes) ? sizes : [];
    if (dietaryInfo !== undefined) product.dietaryInfo = dietaryInfo || {};
    if (spiceLevel !== undefined) product.spiceLevel = parseInt(spiceLevel) || 0;
    if (preparationTime !== undefined) product.preparationTime = parseInt(preparationTime) || 15;
    if (isPopular !== undefined) product.isPopular = Boolean(isPopular);
    if (isNew !== undefined) product.isNew = Boolean(isNew);
    if (isAvailable !== undefined) product.isAvailable = Boolean(isAvailable);
    if (sortOrder !== undefined) product.sortOrder = parseInt(sortOrder) || 0;

    const updatedProduct = await product.save();
    
    res.status(200).json({ 
      success: true, 
      data: transformProductData(updatedProduct),
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Failed to update product', 
      error: error.message 
    });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin/Staff
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.destroy();
    res.status(200).json({ success: true, message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get all customization options
// @route   GET /api/products/customization-options
// @access  Public
const getCustomizationOptions = async (req, res) => {
  try {
    const { optionType } = req.query;
    
    const whereClause = { isAvailable: true };
    if (optionType) {
      whereClause.optionType = optionType;
    }

    const options = await CustomizationOption.findAll({
      where: whereClause,
      order: [['optionType', 'ASC'], ['sortOrder', 'ASC'], ['name', 'ASC']]
    });

    // Group by option type for easier frontend consumption
    const groupedOptions = options.reduce((acc, option) => {
      if (!acc[option.optionType]) {
        acc[option.optionType] = [];
      }
      acc[option.optionType].push(option);
      return acc;
    }, {});

    res.status(200).json({ 
      success: true, 
      data: groupedOptions,
      count: options.length 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get product categories with counts
// @route   GET /api/products/categories
// @access  Public
const getProductCategories = async (req, res) => {
  try {
    const categories = await Product.findAll({
      attributes: [
        'category',
        'subcategory',
        [Product.sequelize.fn('COUNT', Product.sequelize.col('id')), 'count']
      ],
      where: { isAvailable: true },
      group: ['category', 'subcategory'],
      order: [['category', 'ASC'], ['subcategory', 'ASC']]
    });

    // Group by main category
    const groupedCategories = categories.reduce((acc, item) => {
      const category = item.category;
      if (!acc[category]) {
        acc[category] = {
          name: category,
          count: 0,
          subcategories: []
        };
      }
      
      acc[category].count += parseInt(item.dataValues.count);
      
      if (item.subcategory) {
        acc[category].subcategories.push({
          name: item.subcategory,
          count: parseInt(item.dataValues.count)
        });
      }
      
      return acc;
    }, {});

    res.status(200).json({ 
      success: true, 
      data: groupedCategories 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get all products for admin (including inactive)
// @route   GET /api/admin/products
// @access  Private/Admin
const getAllProductsAdmin = async (req, res) => {
  try {
    const {
      category,
      subcategory,
      search,
      sort = 'name',
      order = 'ASC',
      status = 'all' // all, active, inactive
    } = req.query;

    // Build where clause - admin can see all products
    const whereClause = {};

    // Status filter
    if (status === 'active') {
      whereClause.isAvailable = true;
    } else if (status === 'inactive') {
      whereClause.isAvailable = false;
    }

    // Category filter
    if (category) {
      whereClause.category = category;
    }

    // Subcategory filter
    if (subcategory) {
      whereClause.subcategory = subcategory;
    }

    // Search functionality
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { category: { [Op.iLike]: `%${search}%` } },
        { subcategory: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Build order clause
    let orderClause;
    switch (sort) {
      case 'price_asc':
        orderClause = [['price', 'ASC']];
        break;
      case 'price_desc':
        orderClause = [['price', 'DESC']];
        break;
      case 'category':
        orderClause = [['category', 'ASC'], ['subcategory', 'ASC'], ['name', 'ASC']];
        break;
      case 'created':
        orderClause = [['createdAt', 'DESC']];
        break;
      case 'updated':
        orderClause = [['updatedAt', 'DESC']];
        break;
      case 'name':
      default:
        orderClause = [['name', order.toUpperCase()]];
        break;
    }

    const products = await Product.findAll({
      where: whereClause,
      order: orderClause
    });

    // Transform product data
    const transformedProducts = products.map(transformProductData);

    res.status(200).json({ 
      success: true, 
      data: transformedProducts,
      count: products.length,
      filters: {
        category,
        subcategory,
        search,
        sort,
        status
      }
    });
  } catch (error) {
    console.error('Get admin products error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
};

// @desc    Bulk update product status
// @route   PATCH /api/admin/products/bulk-status
// @access  Private/Admin
const bulkUpdateProductStatus = async (req, res) => {
  try {
    const { productIds, isAvailable } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Product IDs array is required'
      });
    }

    const [updatedCount] = await Product.update(
      { isAvailable: Boolean(isAvailable) },
      { where: { id: productIds } }
    );

    res.status(200).json({
      success: true,
      message: `${updatedCount} products updated successfully`,
      updatedCount
    });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update products',
      error: error.message
    });
  }
};

// @desc    Get product statistics for admin dashboard
// @route   GET /api/admin/products/stats
// @access  Private/Admin
const getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.count();
    const activeProducts = await Product.count({ where: { isAvailable: true } });
    const inactiveProducts = totalProducts - activeProducts;
    
    const categoryStats = await Product.findAll({
      attributes: [
        'category',
        [Product.sequelize.fn('COUNT', Product.sequelize.col('id')), 'count']
      ],
      group: ['category'],
      order: [['category', 'ASC']]
    });

    const popularProducts = await Product.count({ where: { isPopular: true } });
    const newProducts = await Product.count({ where: { isNew: true } });

    res.status(200).json({
      success: true,
      data: {
        total: totalProducts,
        active: activeProducts,
        inactive: inactiveProducts,
        popular: popularProducts,
        new: newProducts,
        byCategory: categoryStats.map(item => ({
          category: item.category,
          count: parseInt(item.dataValues.count)
        }))
      }
    });
  } catch (error) {
    console.error('Get product stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get product statistics',
      error: error.message
    });
  }
};

// @desc    Create customization option
// @route   POST /api/products/customization-options
// @access  Private/Admin/Staff
const createCustomizationOption = async (req, res) => {
  try {
    const { optionType, name, displayName, priceModifier, category, isAvailable, sortOrder } = req.body;

    if (!optionType || !name || !displayName) {
      return res.status(400).json({
        success: false,
        message: 'optionType, name, and displayName are required'
      });
    }

    const option = await CustomizationOption.create({
      optionType,
      name,
      displayName,
      priceModifier: parseFloat(priceModifier) || 0,
      category,
      isAvailable: isAvailable !== false,
      sortOrder: parseInt(sortOrder) || 0
    });

    res.status(201).json({ success: true, data: option });
  } catch (error) {
    console.error('Create customization option error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update customization option
// @route   PUT /api/products/customization-options/:id
// @access  Private/Admin/Staff
const updateCustomizationOption = async (req, res) => {
  try {
    const option = await CustomizationOption.findByPk(req.params.id);
    if (!option) {
      return res.status(404).json({ success: false, message: 'Customization option not found' });
    }

    const { optionType, name, displayName, priceModifier, category, isAvailable, sortOrder } = req.body;

    if (optionType !== undefined) option.optionType = optionType;
    if (name !== undefined) option.name = name;
    if (displayName !== undefined) option.displayName = displayName;
    if (priceModifier !== undefined) option.priceModifier = parseFloat(priceModifier);
    if (category !== undefined) option.category = category;
    if (isAvailable !== undefined) option.isAvailable = isAvailable;
    if (sortOrder !== undefined) option.sortOrder = parseInt(sortOrder);

    await option.save();
    res.json({ success: true, data: option });
  } catch (error) {
    console.error('Update customization option error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete customization option
// @route   DELETE /api/products/customization-options/:id
// @access  Private/Admin/Staff
const deleteCustomizationOption = async (req, res) => {
  try {
    const option = await CustomizationOption.findByPk(req.params.id);
    if (!option) {
      return res.status(404).json({ success: false, message: 'Customization option not found' });
    }

    await option.destroy();
    res.json({ success: true, message: 'Customization option deleted' });
  } catch (error) {
    console.error('Delete customization option error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCustomizationOptions,
  createCustomizationOption,
  updateCustomizationOption,
  deleteCustomizationOption,
  getProductCategories,
  getAllProductsAdmin,
  bulkUpdateProductStatus,
  getProductStats,
};
