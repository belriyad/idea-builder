const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { data, generateId } = require('../models/dataStore');
const { JWT_SECRET } = require('../middleware/auth');

/**
 * Partner signup
 */
async function partnerSignup(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if partner already exists
    for (const partner of data.partners.values()) {
      if (partner.email === email) {
        return res.status(409).json({ error: 'Email already registered' });
      }
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create partner account
    const partnerId = generateId();
    const partner = {
      id: partnerId,
      email,
      password_hash,
      verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    data.partners.set(partnerId, partner);

    // In a real app, send verification email here
    const verificationToken = jwt.sign({ partnerId, email }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      message: 'Partner account created. Please check your email for verification.',
      partner_id: partnerId,
      verification_token: verificationToken // In production, this would be emailed
    });
  } catch (error) {
    console.error('Error in partner signup:', error);
    res.status(500).json({ error: 'Failed to create partner account' });
  }
}

/**
 * Verify email
 */
async function verifyEmail(req, res) {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const partner = data.partners.get(decoded.partnerId);

      if (!partner) {
        return res.status(404).json({ error: 'Partner not found' });
      }

      partner.verified = true;
      partner.updated_at = new Date().toISOString();
      data.partners.set(partner.id, partner);

      // Generate JWT for authenticated session
      const authToken = jwt.sign(
        { id: partner.id, email: partner.email, role: 'partner' },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Email verified successfully',
        token: authToken
      });
    } catch (error) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ error: 'Failed to verify email' });
  }
}

/**
 * Send connection request to partner team
 */
async function sendConnectionRequest(req, res) {
  try {
    const userId = req.user.id;
    const { partner_id } = req.body;

    if (!partner_id) {
      return res.status(400).json({ error: 'partner_id is required' });
    }

    const partner = data.partners.get(partner_id);
    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    const collaborationId = generateId();
    const collaboration = {
      id: collaborationId,
      user_id: userId,
      partner_id,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    data.collaborations.set(collaborationId, collaboration);

    res.status(201).json({
      collaboration_id: collaborationId,
      status: 'pending',
      message: 'Connection request sent successfully'
    });
  } catch (error) {
    console.error('Error sending connection request:', error);
    res.status(500).json({ error: 'Failed to send connection request' });
  }
}

/**
 * Get list of ongoing collaborations
 */
async function getCollaborations(req, res) {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    const collaborations = [];
    for (const collab of data.collaborations.values()) {
      if (role === 'partner' && collab.partner_id === userId) {
        collaborations.push(collab);
      } else if (role === 'user' && collab.user_id === userId) {
        collaborations.push(collab);
      }
    }

    res.json(collaborations);
  } catch (error) {
    console.error('Error retrieving collaborations:', error);
    res.status(500).json({ error: 'Failed to retrieve collaborations' });
  }
}

/**
 * Accept or reject collaboration request
 */
async function respondToCollaboration(req, res) {
  try {
    const partnerId = req.user.id;
    const { collaboration_id, status } = req.body;

    if (!collaboration_id || !status) {
      return res.status(400).json({ error: 'collaboration_id and status are required' });
    }

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'status must be "accepted" or "rejected"' });
    }

    const collaboration = data.collaborations.get(collaboration_id);

    if (!collaboration) {
      return res.status(404).json({ error: 'Collaboration not found' });
    }

    if (collaboration.partner_id !== partnerId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    collaboration.status = status;
    collaboration.updated_at = new Date().toISOString();
    data.collaborations.set(collaboration_id, collaboration);

    res.json({
      collaboration_id,
      status,
      message: `Collaboration ${status}`
    });
  } catch (error) {
    console.error('Error responding to collaboration:', error);
    res.status(500).json({ error: 'Failed to respond to collaboration' });
  }
}

module.exports = {
  partnerSignup,
  verifyEmail,
  sendConnectionRequest,
  getCollaborations,
  respondToCollaboration
};
