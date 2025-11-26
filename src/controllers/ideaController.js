const { parseIdea, exportIdeaStructure } = require('../services/ideaService');
const { data, generateId } = require('../models/dataStore');

/**
 * Submit a business idea for structuring
 */
async function createIdea(req, res) {
  try {
    const { idea_text } = req.body;
    const userId = req.user.id;

    if (!idea_text || typeof idea_text !== 'string') {
      return res.status(400).json({ error: 'idea_text is required and must be a string' });
    }

    // Parse the idea and generate structure
    const structure = parseIdea(idea_text);

    // Save to data store
    const ideaId = generateId();
    const idea = {
      id: ideaId,
      user_id: userId,
      idea_text,
      structure,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    data.ideas.set(ideaId, idea);

    res.status(201).json({
      id: ideaId,
      structure,
      created_at: idea.created_at
    });
  } catch (error) {
    console.error('Error creating idea:', error);
    res.status(500).json({ error: 'Failed to create idea' });
  }
}

/**
 * Retrieve a structured idea tree
 */
async function getIdea(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const idea = data.ideas.get(id);

    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    // Check if user owns this idea
    if (idea.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      id: idea.id,
      idea_text: idea.idea_text,
      structure: idea.structure,
      created_at: idea.created_at,
      updated_at: idea.updated_at
    });
  } catch (error) {
    console.error('Error retrieving idea:', error);
    res.status(500).json({ error: 'Failed to retrieve idea' });
  }
}

/**
 * Update a structured idea tree
 */
async function updateIdea(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { structure, idea_text } = req.body;

    const idea = data.ideas.get(id);

    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    if (idea.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update the idea
    if (structure) {
      idea.structure = structure;
    }
    if (idea_text) {
      idea.idea_text = idea_text;
    }
    idea.updated_at = new Date().toISOString();

    data.ideas.set(id, idea);

    res.json({
      id: idea.id,
      structure: idea.structure,
      updated_at: idea.updated_at
    });
  } catch (error) {
    console.error('Error updating idea:', error);
    res.status(500).json({ error: 'Failed to update idea' });
  }
}

/**
 * Delete a structured idea tree
 */
async function deleteIdea(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const idea = data.ideas.get(id);

    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    if (idea.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    data.ideas.delete(id);

    res.json({ message: 'Idea deleted successfully' });
  } catch (error) {
    console.error('Error deleting idea:', error);
    res.status(500).json({ error: 'Failed to delete idea' });
  }
}

/**
 * Export a structured idea tree
 */
async function exportIdea(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { format = 'json' } = req.query;

    const idea = data.ideas.get(id);

    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    if (idea.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const exported = exportIdeaStructure(idea.structure, format);

    res.json(exported);
  } catch (error) {
    console.error('Error exporting idea:', error);
    res.status(500).json({ error: 'Failed to export idea' });
  }
}

module.exports = {
  createIdea,
  getIdea,
  updateIdea,
  deleteIdea,
  exportIdea
};
