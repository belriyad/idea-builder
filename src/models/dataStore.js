// In-memory data store for development
// In production, this would be replaced with a real database

const data = {
  users: new Map(),
  ideas: new Map(),
  trees: new Map(),
  features: new Map(),
  featureSelections: new Map(),
  prdDocuments: new Map(),
  prdTemplates: new Map(),
  prdReviews: new Map(),
  partners: new Map(),
  collaborations: new Map(),
  subscriptions: new Map(),
  plans: new Map(),
  projects: new Map(),
  bids: new Map()
};

// Initialize default data
function initializeDefaults() {
  // Default subscription plans
  data.plans.set('monthly', {
    id: 'monthly',
    name: 'Monthly Plan',
    monthly_cost: 100.00,
    annual_cost: null,
    description: 'Partner subscription - $100 per month'
  });
  
  data.plans.set('annual', {
    id: 'annual',
    name: 'Annual Plan',
    monthly_cost: null,
    annual_cost: 900.00, // $75/month * 12 = $900
    description: 'Partner subscription - $75 per month (billed annually at $900)'
  });
  
  // Default PRD template
  const defaultTemplate = {
    template_id: 'default',
    template_name: 'Standard PRD Template',
    structure: {
      sections: [
        'Overview',
        'Requirements',
        'User Stories',
        'Backend & APIs',
        'Database Structure',
        'Functions & Services',
        'Background Jobs',
        'Acceptance Criteria',
        'Dependencies'
      ]
    }
  };
  data.prdTemplates.set('default', defaultTemplate);
  
  // Default features tree
  const defaultFeatures = {
    id: 'root',
    name: 'All Features',
    parent_id: null,
    children: [
      { id: 'idea-structuring', name: 'Idea Structuring Tool', parent_id: 'root' },
      { id: 'tree-generation', name: 'Tree Generation', parent_id: 'root' },
      { id: 'feature-selection', name: 'Feature Selection', parent_id: 'root' },
      { id: 'prd-generation', name: 'PRD Document Generation', parent_id: 'root' },
      { id: 'document-customization', name: 'Document Customization', parent_id: 'root' },
      { id: 'ai-guidance', name: 'AI Guidance', parent_id: 'root' },
      { id: 'human-review', name: 'Human Review Option', parent_id: 'root' },
      { id: 'partner-integration', name: 'Partner Integration', parent_id: 'root' },
      { id: 'partner-signup', name: 'Partner Signup', parent_id: 'root' },
      { id: 'subscription-plans', name: 'Subscription Plans', parent_id: 'root' },
      { id: 'project-bidding', name: 'Project Bidding', parent_id: 'root' }
    ]
  };
  data.features.set('root', defaultFeatures);
}

// Initialize on load
initializeDefaults();

// Helper functions
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function createUser(email, passwordHash, role = 'user') {
  const id = generateId();
  const user = {
    id,
    email,
    password_hash: passwordHash,
    role,
    verified: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  data.users.set(id, user);
  return user;
}

function getUserByEmail(email) {
  for (const user of data.users.values()) {
    if (user.email === email) {
      return user;
    }
  }
  return null;
}

module.exports = {
  data,
  generateId,
  createUser,
  getUserByEmail
};
