const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const { generateAIReply } = require('../services/aiService');
const axios = require('axios');

// Generate AI reply suggestion
router.post('/:id/generate-reply', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found'
      });
    }

    // Generate AI reply using the lead's original content and AI summary
    const suggestedReply = await generateAIReply(
      lead.originalContent,
      lead.aiSummary,
      lead.source
    );

    res.json({
      success: true,
      suggestedReply
    });

  } catch (error) {
    console.error('Error generating AI reply:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate AI reply',
      message: error.message
    });
  }
});

// Send reply and trigger n8n workflow
router.post('/:id/reply', async (req, res) => {
  try {
    const { replyText } = req.body;
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found'
      });
    }

    if (!replyText || !replyText.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Reply text is required'
      });
    }

    // Add reply to lead's history
    const replyRecord = {
      replyText: replyText.trim(),
      sentAt: new Date(),
      sentBy: 'system', // You can add user authentication later
      status: 'queued'
    };

    if (!lead.replies) {
      lead.replies = [];
    }
    lead.replies.push(replyRecord);
    
    // Update lead status if it was "New"
    if (lead.status === 'New') {
      lead.status = 'Contacted';
    }

    await lead.save();

    // Trigger n8n webhook for actual message sending
    const n8nWebhookUrl = process.env.N8N_REPLY_WEBHOOK_URL;
    
    if (n8nWebhookUrl) {
      try {
        await axios.post(n8nWebhookUrl, {
          leadId: lead._id,
          source: lead.source,
          originalMessage: lead.originalContent,
          replyText: replyText.trim(),
          timestamp: new Date().toISOString(),
          priority: lead.priority,
          // Include any contact info you might have
          // This will be used by n8n to send the actual message
          metadata: {
            createdAt: lead.createdAt,
            aiSummary: lead.aiSummary
          }
        }, {
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log('n8n webhook triggered successfully');
        replyRecord.status = 'sent';
        await lead.save();
      } catch (webhookError) {
        console.error('Error triggering n8n webhook:', webhookError.message);
        // Don't fail the entire request if webhook fails
        // The reply is still saved in the database
        replyRecord.status = 'failed';
        await lead.save();
      }
    } else {
      console.warn('N8N_REPLY_WEBHOOK_URL not configured. Reply saved but not sent.');
    }

    res.json({
      success: true,
      message: 'Reply sent successfully',
      reply: replyRecord,
      lead: {
        _id: lead._id,
        status: lead.status,
        replies: lead.replies
      }
    });

  } catch (error) {
    console.error('Error sending reply:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send reply',
      message: error.message
    });
  }
});

// Get reply history for a lead
router.get('/:id/replies', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found'
      });
    }

    res.json({
      success: true,
      replies: lead.replies || []
    });

  } catch (error) {
    console.error('Error fetching replies:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch replies',
      message: error.message
    });
  }
});

module.exports = router;
