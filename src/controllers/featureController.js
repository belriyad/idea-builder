const { data, generateId } = require('../models/dataStore');

/**
 * Get the feature tree
 */
async function getFeatureTree(req, res) {
  try {
    const features = data.features.get('root');
    
    if (!features) {
      return res.status(404).json({ error: 'Feature tree not found' });
    }

    res.json(features);
  } catch (error) {
    console.error('Error retrieving feature tree:', error);
    res.status(500).json({ error: 'Failed to retrieve feature tree' });
  }
}

/**
 * Save user feature selections
 */
async function saveFeatureSelection(req, res) {
  try {
    const userId = req.user.id;
    const { selectedFeatures } = req.body;

    if (!Array.isArray(selectedFeatures)) {
      return res.status(400).json({ error: 'selectedFeatures must be an array' });
    }

    // Store selection for this user
    const selectionId = generateId();
    const selection = {
      id: selectionId,
      user_id: userId,
      feature_ids: selectedFeatures,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    data.featureSelections.set(userId, selection);

    res.status(201).json({
      id: selectionId,
      message: 'Feature selection saved successfully',
      selected_count: selectedFeatures.length
    });
  } catch (error) {
    console.error('Error saving feature selection:', error);
    res.status(500).json({ error: 'Failed to save feature selection' });
  }
}

/**
 * Retrieve user feature selections
 */
async function getUserFeatureSelections(req, res) {
  try {
    const userId = req.user.id;

    const selection = data.featureSelections.get(userId);

    if (!selection) {
      return res.json({
        user_id: userId,
        feature_ids: [],
        message: 'No selections found'
      });
    }

    res.json({
      user_id: userId,
      feature_ids: selection.feature_ids,
      created_at: selection.created_at,
      updated_at: selection.updated_at
    });
  } catch (error) {
    console.error('Error retrieving feature selections:', error);
    res.status(500).json({ error: 'Failed to retrieve feature selections' });
  }
}

module.exports = {
  getFeatureTree,
  saveFeatureSelection,
  getUserFeatureSelections
};
