const { data, generateId } = require('../models/dataStore');

/**
 * Generate tree service
 */
function generateTree(ideaData) {
  // Create a tree structure from idea data
  return {
    root: {
      id: 'root',
      name: ideaData.name || 'Business Idea',
      type: 'root',
      children: ideaData.features || []
    }
  };
}

/**
 * Create a new feature tree
 */
async function createTree(req, res) {
  try {
    const userId = req.user.id;
    const { ideaData } = req.body;

    if (!ideaData) {
      return res.status(400).json({ error: 'ideaData is required' });
    }

    // Generate tree structure
    const treeStructure = generateTree(ideaData);

    const treeId = generateId();
    const tree = {
      id: treeId,
      user_id: userId,
      data: treeStructure,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    data.trees.set(treeId, tree);

    res.status(201).json({
      id: treeId,
      data: tree.data,
      created_at: tree.created_at
    });
  } catch (error) {
    console.error('Error creating tree:', error);
    res.status(500).json({ error: 'Failed to create tree' });
  }
}

/**
 * Retrieve a feature tree by ID
 */
async function getTree(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const tree = data.trees.get(id);

    if (!tree) {
      return res.status(404).json({ error: 'Tree not found' });
    }

    if (tree.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(tree);
  } catch (error) {
    console.error('Error retrieving tree:', error);
    res.status(500).json({ error: 'Failed to retrieve tree' });
  }
}

/**
 * Update a feature tree
 */
async function updateTree(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { data: treeData } = req.body;

    const tree = data.trees.get(id);

    if (!tree) {
      return res.status(404).json({ error: 'Tree not found' });
    }

    if (tree.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (treeData) {
      tree.data = treeData;
      tree.updated_at = new Date().toISOString();
      data.trees.set(id, tree);
    }

    res.json(tree);
  } catch (error) {
    console.error('Error updating tree:', error);
    res.status(500).json({ error: 'Failed to update tree' });
  }
}

/**
 * Delete a feature tree
 */
async function deleteTree(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const tree = data.trees.get(id);

    if (!tree) {
      return res.status(404).json({ error: 'Tree not found' });
    }

    if (tree.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    data.trees.delete(id);

    res.json({ message: 'Tree deleted successfully' });
  } catch (error) {
    console.error('Error deleting tree:', error);
    res.status(500).json({ error: 'Failed to delete tree' });
  }
}

/**
 * Export a feature tree
 */
async function exportTree(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { format = 'json' } = req.query;

    const tree = data.trees.get(id);

    if (!tree) {
      return res.status(404).json({ error: 'Tree not found' });
    }

    if (tree.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Export based on format
    if (format === 'json') {
      res.json({
        format: 'json',
        data: tree.data
      });
    } else {
      res.json({
        format,
        data: tree.data,
        note: `${format} export would be implemented with appropriate library`
      });
    }
  } catch (error) {
    console.error('Error exporting tree:', error);
    res.status(500).json({ error: 'Failed to export tree' });
  }
}

module.exports = {
  createTree,
  getTree,
  updateTree,
  deleteTree,
  exportTree
};
