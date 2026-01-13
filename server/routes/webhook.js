const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// POST /api/webhook - Receive data from n8n
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

module.exports = router;
