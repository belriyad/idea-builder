const request = require('supertest');
const app = require('../src/server');

describe('Idea Builder API Tests', () => {
  let authToken;
  let userId;

  describe('Authentication', () => {
    test('should register a new user', async () => {
      const response = await request(app)
        .post('/api/test/register')
        .send({
          email: 'test@example.com',
          password: 'testpassword123'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
      
      authToken = response.body.token;
      userId = response.body.user.id;
    });

    test('should login an existing user', async () => {
      const response = await request(app)
        .post('/api/test/login')
        .send({
          email: 'test@example.com',
          password: 'testpassword123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    test('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/test/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('Health Check', () => {
    test('should return health status', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
    });
  });

  describe('Idea Structuring', () => {
    let ideaId;

    test('should create a new idea', async () => {
      const response = await request(app)
        .post('/api/ideas')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          idea_text: 'I want to build a platform for entrepreneurs to structure their business ideas into actionable plans.'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('structure');
      
      ideaId = response.body.id;
    });

    test('should retrieve an idea', async () => {
      const response = await request(app)
        .get(`/api/ideas/${ideaId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', ideaId);
      expect(response.body).toHaveProperty('structure');
    });

    test('should update an idea', async () => {
      const response = await request(app)
        .put(`/api/ideas/${ideaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          structure: { updated: true }
        });

      expect(response.status).toBe(200);
      expect(response.body.structure).toHaveProperty('updated', true);
    });

    test('should export an idea', async () => {
      const response = await request(app)
        .get(`/api/ideas/export/${ideaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .query({ format: 'json' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('format', 'json');
    });
  });

  describe('Feature Selection', () => {
    test('should get feature tree', async () => {
      const response = await request(app)
        .get('/api/features/tree')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('children');
    });

    test('should save feature selections', async () => {
      const response = await request(app)
        .post('/api/features/selection')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          selectedFeatures: ['idea-structuring', 'tree-generation']
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('selected_count', 2);
    });

    test('should retrieve feature selections', async () => {
      const response = await request(app)
        .get('/api/features/selection')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('feature_ids');
      expect(response.body.feature_ids).toContain('idea-structuring');
    });
  });

  describe('PRD Generation', () => {
    test('should generate PRD with payment', async () => {
      const response = await request(app)
        .post('/api/prd/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          payment_token: 'test_payment_token',
          project_details: {
            overview: 'Test project',
            requirements: ['Feature 1', 'Feature 2']
          }
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('content');
    });

    test('should reject PRD generation without payment', async () => {
      const response = await request(app)
        .post('/api/prd/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          project_details: {}
        });

      expect(response.status).toBe(402);
    });

    test('should get PRD templates', async () => {
      const response = await request(app)
        .get('/api/prd/templates')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Partner Integration', () => {
    let partnerId;

    test('should signup a partner', async () => {
      const response = await request(app)
        .post('/api/partners/signup')
        .send({
          email: 'partner@example.com',
          password: 'partnerpass123'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('partner_id');
      
      partnerId = response.body.partner_id;
    });

    test('should send connection request', async () => {
      const response = await request(app)
        .post('/api/partners/request')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          partner_id: partnerId
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('collaboration_id');
    });
  });

  describe('Subscriptions', () => {
    test('should get subscription plans', async () => {
      const response = await request(app)
        .get('/api/subscriptions/plans')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('should subscribe to a plan', async () => {
      const response = await request(app)
        .post('/api/subscriptions/subscribe')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          plan_type: 'monthly',
          payment_token: 'test_payment_token'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('subscription_id');
    });
  });

  describe('Projects and Bidding', () => {
    let projectId;

    test('should create a project', async () => {
      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Project',
          description: 'A test project for bidding'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('project_id');
      
      projectId = response.body.project_id;
    });

    test('should get projects', async () => {
      const response = await request(app)
        .get('/api/projects');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should submit a bid', async () => {
      const response = await request(app)
        .post(`/api/projects/${projectId}/bid`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 5000,
          timeline: '3 months'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('bid_id');
    });
  });
});
