const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// GET /api/leads - Fetch all leads
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching leads',
      error: error.message
    });
  }
});

// POST /api/leads - Create new lead (for webhook)
router.post('/', async (req, res) => {
  try {
    const { source, originalContent, aiSummary, priority, status } = req.body;

    // Validate required fields
    if (!source || !originalContent) {
      return res.status(400).json({
        success: false,
        message: 'Source and originalContent are required fields'
      });
    }

    // Create new lead
    const lead = new Lead({
      source,
      originalContent,
      aiSummary: aiSummary || '',
      priority: priority || 'Medium',
      status: status || 'New'
    });

    // Save to database
    await lead.save();

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: lead
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating lead',
      error: error.message
    });
  }
});

// PATCH /api/leads/:id - Update lead status
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority } = req.body;

    const lead = await Lead.findById(id);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    if (status) lead.status = status;
    if (priority) lead.priority = priority;

    await lead.save();

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: lead
    });
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating lead',
      error: error.message
    });
  }
});

module.exports = router;
