/**
 * Generate a PRD document
 * @param {string} templateId - Template to use
 * @param {object} projectDetails - Project information
 * @returns {object} - Generated PRD
 */
function generatePRD(templateId, projectDetails) {
  const prd = {
    overview: projectDetails.overview || 'Product overview',
    requirements: projectDetails.requirements || [],
    userStories: projectDetails.userStories || [],
    technicalDetails: {
      backend: projectDetails.backend || {},
      database: projectDetails.database || {},
      apis: projectDetails.apis || []
    },
    functions: projectDetails.functions || [],
    backgroundJobs: projectDetails.backgroundJobs || [],
    acceptanceCriteria: projectDetails.acceptanceCriteria || [],
    dependencies: projectDetails.dependencies || []
  };

  return prd;
}

/**
 * Validate PRD document
 * @param {object} prdDocument - PRD to validate
 * @returns {object} - Validation report
 */
function validatePRD(prdDocument) {
  const errors = [];
  const warnings = [];

  // Check required sections
  const requiredSections = ['overview', 'requirements', 'acceptanceCriteria'];
  
  for (const section of requiredSections) {
    if (!prdDocument[section]) {
      errors.push(`Missing required section: ${section}`);
    }
  }

  // Check if requirements array is not empty
  if (Array.isArray(prdDocument.requirements) && prdDocument.requirements.length === 0) {
    warnings.push('Requirements array is empty');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

module.exports = {
  generatePRD,
  validatePRD
};
