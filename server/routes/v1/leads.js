const express = require('express');
const router = express.Router();
const Lead = require('../../models/Lead');
const aiService = require('../../services/aiService');
const { validateLead, handleValidationErrors } = require('../../middleware/validation');

/**
 * POST /api/v1/leads
 * Create a new lead with AI-powered summarization
 */
router.post('/', validateLead, handleValidationErrors, async (req, res) => {
  try {
    const { source, originalContent, message, aiSummary, priority, status } = req.body;

    // Use 'message' field if provided, otherwise use 'originalContent'
    const content = message || originalContent;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Either originalContent or message field is required'
      });
    }

    // Generate AI summary if not provided
    let finalSummary = aiSummary;
    if (!finalSummary && process.env.ENABLE_AI_SUMMARY !== 'false') {
      try {
        finalSummary = await aiService.generateSummary(content, source);
      } catch (error) {
        console.error('AI summary generation failed:', error.message);
        // Continue without summary if AI fails
        finalSummary = '';
      }
    }

    // Determine priority if not provided (optional AI enhancement)
    let finalPriority = priority || 'Medium';
    if (!priority && process.env.ENABLE_AI_PRIORITY === 'true') {
      try {
        finalPriority = await aiService.determinePriority(content);
      } catch (error) {
        console.error('AI priority determination failed:', error.message);
        // Use default priority
      }
    }

    // Create new lead
    const lead = new Lead({
      source: source.trim(),
      originalContent: content.trim(),
      aiSummary: finalSummary,
      priority: finalPriority,
      status: status || 'New'
    });

    // Save to database
    await lead.save();

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: {
        _id: lead._id,
        source: lead.source,
        originalContent: lead.originalContent,
        aiSummary: lead.aiSummary,
        priority: lead.priority,
        status: lead.status,
        createdAt: lead.createdAt,
        updatedAt: lead.updatedAt
      }
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Lead with this information already exists',
        error: 'Duplicate entry'
      });
    }

    // Handle validation errors from Mongoose
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    // Generic server error
    res.status(500).json({
      success: false,
      message: 'Server error while creating lead',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/v1/leads
 * Get all leads with optional filtering and pagination
 */
router.get('/', async (req, res) => {
  try {
    const { 
      status, 
      priority, 
      source, 
      page = 1, 
      limit = 50,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (source) filter.source = { $regex: source, $options: 'i' };

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Lead.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching leads',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
