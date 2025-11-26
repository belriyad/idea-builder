const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const ideaRoutes = require('./routes/ideaRoutes');
const treeRoutes = require('./routes/treeRoutes');
const featureRoutes = require('./routes/featureRoutes');
const prdRoutes = require('./routes/prdRoutes');
const partnerRoutes = require('./routes/partnerRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const projectRoutes = require('./routes/projectRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/test', authRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/tree', treeRoutes);
app.use('/api/features', featureRoutes);
app.use('/api/prd', prdRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/projects', projectRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
