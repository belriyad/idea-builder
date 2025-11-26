/**
 * Parse a business idea and generate a structured tree
 * @param {string} ideaText - The business idea text input
 * @returns {object} - Structured tree with vision, mission, and features
 */
function parseIdea(ideaText) {
  // Generate a simple structure based on the input
  // In a real implementation, this would use NLP
  const structure = {
    type: 'root',
    name: 'Value Proposition',
    description: extractValueProposition(ideaText),
    children: [
      {
        type: 'vision_mission',
        name: 'Vision & Mission',
        vision: extractVision(ideaText),
        mission: extractMission(ideaText),
        children: extractFeatures(ideaText)
      }
    ]
  };
  
  return structure;
}

/**
 * Extract value proposition from idea text
 */
function extractValueProposition(ideaText) {
  // Simple extraction - look for keywords
  const keywords = ['help', 'solve', 'enable', 'provide', 'deliver'];
  const sentences = ideaText.split(/[.!?]+/);
  
  for (const sentence of sentences) {
    const lowerSentence = sentence.toLowerCase();
    for (const keyword of keywords) {
      if (lowerSentence.includes(keyword)) {
        return sentence.trim();
      }
    }
  }
  
  return sentences.length > 0 ? sentences[0].trim() : 'Empowering users to achieve their goals';
}

/**
 * Extract vision from idea text
 */
function extractVision(ideaText) {
  const hasWebsite = ideaText.toLowerCase().includes('website');
  const hasPlatform = ideaText.toLowerCase().includes('platform');
  const hasApp = ideaText.toLowerCase().includes('app');
  
  if (hasWebsite || hasPlatform || hasApp) {
    return 'Transforming Ideas into Reality';
  }
  
  return 'Building innovative solutions for modern challenges';
}

/**
 * Extract mission from idea text
 */
function extractMission(ideaText) {
  return `Our mission is to ${extractValueProposition(ideaText).toLowerCase()}`;
}

/**
 * Extract features from idea text
 */
function extractFeatures(ideaText) {
  const features = [];
  
  // Look for common feature indicators
  const featureIndicators = [
    'feature', 'tool', 'system', 'service', 'module', 'component',
    'allow', 'enable', 'provide', 'generate', 'create', 'manage'
  ];
  
  const sentences = ideaText.split(/[.!?,]+/).filter(s => s.trim().length > 10);
  
  sentences.forEach((sentence, index) => {
    const lowerSentence = sentence.toLowerCase();
    for (const indicator of featureIndicators) {
      if (lowerSentence.includes(indicator)) {
        features.push({
          type: 'feature',
          id: `feature-${index + 1}`,
          name: generateFeatureName(sentence, index + 1),
          description: sentence.trim(),
          children: []
        });
        break;
      }
    }
  });
  
  // Ensure at least some default features
  if (features.length === 0) {
    features.push({
      type: 'feature',
      id: 'feature-1',
      name: 'Core Functionality',
      description: 'Primary features of the product',
      children: []
    });
  }
  
  return features;
}

/**
 * Generate a concise feature name from a sentence
 */
function generateFeatureName(sentence, index) {
  const words = sentence.trim().split(/\s+/);
  const meaningfulWords = words.filter(w => 
    w.length > 3 && !['the', 'and', 'for', 'with', 'that', 'this', 'from'].includes(w.toLowerCase())
  );
  
  if (meaningfulWords.length >= 2) {
    return meaningfulWords.slice(0, 3).map(w => 
      w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    ).join(' ');
  }
  
  return `Feature ${index}`;
}

/**
 * Export idea structure to specified format
 * @param {object} structure - The tree structure
 * @param {string} format - The export format (json, pdf, etc.)
 * @returns {object} - Exported data
 */
function exportIdeaStructure(structure, format = 'json') {
  if (format === 'json') {
    return {
      format: 'json',
      data: JSON.stringify(structure, null, 2)
    };
  }
  
  // For other formats, return JSON for now
  // In a real implementation, would generate PDF, etc.
  return {
    format: format,
    data: JSON.stringify(structure, null, 2),
    note: `${format} export would be implemented with appropriate library`
  };
}

module.exports = {
  parseIdea,
  exportIdeaStructure,
  extractValueProposition,
  extractVision,
  extractMission,
  extractFeatures
};
