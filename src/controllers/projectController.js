const { data, generateId } = require('../models/dataStore');

/**
 * Get list of available projects
 */
async function getProjects(req, res) {
  try {
    const projects = Array.from(data.projects.values()).map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      owner_id: project.owner_id,
      created_at: project.created_at
    }));

    res.json(projects);
  } catch (error) {
    console.error('Error retrieving projects:', error);
    res.status(500).json({ error: 'Failed to retrieve projects' });
  }
}

/**
 * Submit a bid for a project
 */
async function submitBid(req, res) {
  try {
    const partnerId = req.user.id;
    const { id: projectId } = req.params;
    const { amount, timeline } = req.body;

    if (!amount || !timeline) {
      return res.status(400).json({ error: 'amount and timeline are required' });
    }

    const project = data.projects.get(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const bidId = generateId();
    const bid = {
      id: bidId,
      project_id: projectId,
      partner_id: partnerId,
      amount: parseFloat(amount),
      timeline,
      created_at: new Date().toISOString()
    };

    data.bids.set(bidId, bid);

    res.status(201).json({
      bid_id: bidId,
      project_id: projectId,
      amount: bid.amount,
      timeline: bid.timeline,
      message: 'Bid submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting bid:', error);
    res.status(500).json({ error: 'Failed to submit bid' });
  }
}

/**
 * Get bids for a specific project
 */
async function getProjectBids(req, res) {
  try {
    const userId = req.user.id;
    const { id: projectId } = req.params;

    const project = data.projects.get(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Only project owner can view bids
    if (project.owner_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const bids = [];
    for (const bid of data.bids.values()) {
      if (bid.project_id === projectId) {
        bids.push(bid);
      }
    }

    res.json(bids);
  } catch (error) {
    console.error('Error retrieving bids:', error);
    res.status(500).json({ error: 'Failed to retrieve bids' });
  }
}

/**
 * Create a new project (for testing)
 */
async function createProject(req, res) {
  try {
    const userId = req.user.id;
    const { title, description, prd_details } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'title and description are required' });
    }

    const projectId = generateId();
    const project = {
      id: projectId,
      title,
      description,
      prd_details: prd_details || {},
      owner_id: userId,
      created_at: new Date().toISOString()
    };

    data.projects.set(projectId, project);

    res.status(201).json({
      project_id: projectId,
      title,
      description,
      created_at: project.created_at,
      message: 'Project created successfully'
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
}

module.exports = {
  getProjects,
  submitBid,
  getProjectBids,
  createProject
};
