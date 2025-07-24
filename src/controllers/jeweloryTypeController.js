const JewelryType = require('../models/jewelryType');

// @desc    Get all jewelry types
// @route   GET /api/jewelry-types
// @access  Public
const getJewelryTypes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === 'true';
    }
    if (req.query.type) {
      filter.type = new RegExp(req.query.type, 'i');
    }
    
    // Sort options
    const sortOptions = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      sortOptions[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
      sortOptions.type = 1; // Default sort by type alphabetically
    }
    
    const jewelryTypes = await JewelryType.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
    
    const total = await JewelryType.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      data: jewelryTypes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single jewelry type
// @route   GET /api/jewelry-types/:id
// @access  Public
const getJewelryType = async (req, res) => {
  try {
    const jewelryType = await JewelryType.findById(req.params.id);
    
    if (!jewelryType) {
      return res.status(404).json({
        success: false,
        message: 'Jewelry type not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: jewelryType
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Create new jewelry type
// @route   POST /api/jewelry-types
// @access  Public
const createJewelryType = async (req, res) => {
  try {
    const { type, description, image } = req.body;
    
    // Check if jewelry type already exists
    const existingType = await JewelryType.findOne({ 
      type: { $regex: new RegExp(`^${type}$`, 'i') } 
    });
    
    if (existingType) {
      return res.status(400).json({
        success: false,
        message: 'Jewelry type already exists'
      });
    }
    
    const jewelryType = await JewelryType.create({
      type,
      description,
      image
    });
    
    res.status(201).json({
      success: true,
      data: jewelryType,
      message: 'Jewelry type created successfully'
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update jewelry type
// @route   PUT /api/jewelry-types/:id
// @access  Public
const updateJewelryType = async (req, res) => {
  try {
    const { type, description, image } = req.body;
    
    // Check if updating to a type that already exists (excluding current one)
    if (type) {
      const existingType = await JewelryType.findOne({ 
        type: { $regex: new RegExp(`^${type}$`, 'i') },
        _id: { $ne: req.params.id }
      });
      
      if (existingType) {
        return res.status(400).json({
          success: false,
          message: 'Jewelry type already exists'
        });
      }
    }
    
    const jewelryType = await JewelryType.findByIdAndUpdate(
      req.params.id,
      { type, description, image },
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!jewelryType) {
      return res.status(404).json({
        success: false,
        message: 'Jewelry type not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: jewelryType,
      message: 'Jewelry type updated successfully'
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Delete jewelry type
// @route   DELETE /api/jewelry-types/:id
// @access  Public
const deleteJewelryType = async (req, res) => {
  try {
    const jewelryType = await JewelryType.findByIdAndDelete(req.params.id);
    
    if (!jewelryType) {
      return res.status(404).json({
        success: false,
        message: 'Jewelry type not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Jewelry type deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Toggle jewelry type status (active/inactive)
// @route   PATCH /api/jewelry-types/:id/toggle
// @access  Public
const toggleJewelryTypeStatus = async (req, res) => {
  try {
    const jewelryType = await JewelryType.findById(req.params.id);
    
    if (!jewelryType) {
      return res.status(404).json({
        success: false,
        message: 'Jewelry type not found'
      });
    }
    
    jewelryType.isActive = !jewelryType.isActive;
    await jewelryType.save();
    
    res.status(200).json({
      success: true,
      data: jewelryType,
      message: `Jewelry type ${jewelryType.isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Search jewelry types
// @route   GET /api/jewelry-types/search
// @access  Public
const searchJewelryTypes = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const jewelryTypes = await JewelryType.find({
      $text: { $search: q }
    }).sort({ score: { $meta: 'textScore' } });
    
    res.status(200).json({
      success: true,
      data: jewelryTypes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

module.exports = {
  getJewelryTypes,
  getJewelryType,
  createJewelryType,
  updateJewelryType,
  deleteJewelryType,
  toggleJewelryTypeStatus,
  searchJewelryTypes
};