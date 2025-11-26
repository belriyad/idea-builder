const { data, generateId } = require('../models/dataStore');
const { generatePRD, validatePRD } = require('../services/prdService');

/**
 * Generate a new PRD document (requires $5 payment)
 */
async function createPRD(req, res) {
  try {
    const userId = req.user.id;
    const { template_id = 'default', project_details, payment_token } = req.body;

    // In a real implementation, verify payment here
    if (!payment_token) {
      return res.status(402).json({ 
        error: 'Payment required',
        message: 'A payment token is required to generate PRD documents ($5 fee)'
      });
    }

    // Simulate payment verification
    // In production, this would call Stripe API
    const paymentVerified = payment_token === 'test_payment_token' || payment_token.startsWith('tok_');

    if (!paymentVerified) {
      return res.status(402).json({ 
        error: 'Payment verification failed',
        message: 'Invalid payment token'
      });
    }

    // Generate PRD
    const prdContent = generatePRD(template_id, project_details || {});

    // Validate PRD
    const validation = validatePRD(prdContent);

    const prdId = generateId();
    const prd = {
      id: prdId,
      content: prdContent,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      owner_id: userId,
      validation
    };

    data.prdDocuments.set(prdId, prd);

    res.status(201).json({
      id: prdId,
      content: prd.content,
      validation: prd.validation,
      created_at: prd.created_at
    });
  } catch (error) {
    console.error('Error creating PRD:', error);
    res.status(500).json({ error: 'Failed to create PRD' });
  }
}

/**
 * Retrieve available PRD templates
 */
async function getTemplates(req, res) {
  try {
    const templates = Array.from(data.prdTemplates.values());
    res.json(templates);
  } catch (error) {
    console.error('Error retrieving templates:', error);
    res.status(500).json({ error: 'Failed to retrieve templates' });
  }
}

/**
 * Update an existing PRD template
 */
async function updateTemplate(req, res) {
  try {
    const { template_id, template_name, structure } = req.body;

    if (!template_id) {
      return res.status(400).json({ error: 'template_id is required' });
    }

    const template = data.prdTemplates.get(template_id);

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    if (template_name) {
      template.template_name = template_name;
    }
    if (structure) {
      template.structure = structure;
    }

    data.prdTemplates.set(template_id, template);

    res.json(template);
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ error: 'Failed to update template' });
  }
}

/**
 * Customize PRD by selecting features
 */
async function customizePRD(req, res) {
  try {
    const userId = req.user.id;
    const { selectedFeatures, customizations } = req.body;

    if (!Array.isArray(selectedFeatures)) {
      return res.status(400).json({ error: 'selectedFeatures must be an array' });
    }

    // Generate customized PRD based on selections
    const customizedPRD = {
      features: selectedFeatures,
      customizations: customizations || {},
      generated_at: new Date().toISOString()
    };

    res.json(customizedPRD);
  } catch (error) {
    console.error('Error customizing PRD:', error);
    res.status(500).json({ error: 'Failed to customize PRD' });
  }
}

/**
 * Preview customized PRD
 */
async function previewPRD(req, res) {
  try {
    const { selectedFeatures, customizations } = req.query;

    const preview = {
      preview: true,
      features: selectedFeatures ? JSON.parse(selectedFeatures) : [],
      customizations: customizations ? JSON.parse(customizations) : {},
      note: 'This is a preview. No changes have been saved.'
    };

    res.json(preview);
  } catch (error) {
    console.error('Error previewing PRD:', error);
    res.status(500).json({ error: 'Failed to preview PRD' });
  }
}

/**
 * Export PRD in selected format
 */
async function exportPRD(req, res) {
  try {
    const { format = 'json' } = req.body;
    const { prd_id } = req.body;
    const userId = req.user.id;

    if (!prd_id) {
      return res.status(400).json({ error: 'prd_id is required' });
    }

    const prd = data.prdDocuments.get(prd_id);

    if (!prd) {
      return res.status(404).json({ error: 'PRD not found' });
    }

    if (prd.owner_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Export based on format
    let exportData;
    if (format === 'json') {
      exportData = JSON.stringify(prd.content, null, 2);
    } else {
      exportData = JSON.stringify(prd.content, null, 2);
    }

    res.json({
      format,
      data: exportData,
      note: format !== 'json' ? `${format} export would be implemented with appropriate library` : undefined
    });
  } catch (error) {
    console.error('Error exporting PRD:', error);
    res.status(500).json({ error: 'Failed to export PRD' });
  }
}

/**
 * Submit PRD for human review ($100 fee)
 */
async function submitForReview(req, res) {
  try {
    const userId = req.user.id;
    const { prd_document, payment_token } = req.body;

    if (!prd_document) {
      return res.status(400).json({ error: 'prd_document is required' });
    }

    // Verify payment ($100)
    if (!payment_token) {
      return res.status(402).json({ 
        error: 'Payment required',
        message: 'A payment token is required for human review ($100 fee)'
      });
    }

    // Simulate payment verification
    const paymentVerified = payment_token === 'test_payment_token' || payment_token.startsWith('tok_');

    if (!paymentVerified) {
      return res.status(402).json({ 
        error: 'Payment verification failed',
        message: 'Invalid payment token'
      });
    }

    const reviewId = generateId();
    const review = {
      review_id: reviewId,
      user_id: userId,
      prd_document,
      status: 'pending',
      feedback: null,
      submitted_at: new Date().toISOString()
    };

    data.prdReviews.set(reviewId, review);

    res.status(201).json({
      review_id: reviewId,
      status: 'pending',
      message: 'PRD submitted for review. You will be notified within 3 business days.',
      submitted_at: review.submitted_at
    });
  } catch (error) {
    console.error('Error submitting PRD for review:', error);
    res.status(500).json({ error: 'Failed to submit PRD for review' });
  }
}

/**
 * Check review status
 */
async function getReviewStatus(req, res) {
  try {
    const userId = req.user.id;
    const { review_id } = req.query;

    if (review_id) {
      const review = data.prdReviews.get(review_id);
      
      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      if (review.user_id !== userId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      return res.json(review);
    }

    // Get all reviews for user
    const userReviews = [];
    for (const review of data.prdReviews.values()) {
      if (review.user_id === userId) {
        userReviews.push(review);
      }
    }

    res.json(userReviews);
  } catch (error) {
    console.error('Error getting review status:', error);
    res.status(500).json({ error: 'Failed to get review status' });
  }
}

module.exports = {
  createPRD,
  getTemplates,
  updateTemplate,
  customizePRD,
  previewPRD,
  exportPRD,
  submitForReview,
  getReviewStatus
};
