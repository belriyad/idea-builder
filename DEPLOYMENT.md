# Deployment Guide

This guide explains how to deploy the Idea Builder platform to various test and production environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development with Docker](#local-development-with-docker)
3. [Automated Deployment (GitHub Actions)](#automated-deployment-github-actions)
4. [Manual Deployment Options](#manual-deployment-options)
5. [Environment Variables](#environment-variables)
6. [Health Checks](#health-checks)

## Prerequisites

- Node.js 18.x or higher
- Docker and Docker Compose (for containerized deployment)
- Git
- Access to deployment platform (Heroku, VPS, etc.)

## Local Development with Docker

### Quick Start

1. **Build and run with Docker Compose:**
   ```bash
   # Create .env file
   cp .env.example .env
   
   # Edit .env and set JWT_SECRET
   
   # Build and start
   docker-compose up -d
   
   # View logs
   docker-compose logs -f
   
   # Stop
   docker-compose down
   ```

2. **Access the application:**
   - Web interface: http://localhost:3000
   - Health check: http://localhost:3000/health

### Build Docker Image Manually

```bash
# Build image
docker build -t idea-builder:latest .

# Run container
docker run -d \
  -p 3000:3000 \
  -e JWT_SECRET=your-secret-key \
  -e NODE_ENV=production \
  --name idea-builder \
  idea-builder:latest

# Check health
curl http://localhost:3000/health
```

## Automated Deployment (GitHub Actions)

The repository includes a GitHub Actions workflow (`.github/workflows/deploy-test.yml`) that automatically:

1. Runs tests on every push to `copilot/**` branches
2. Builds the application
3. Deploys to test environment (when triggered manually)

### Supported Deployment Targets

The workflow supports three deployment options:

#### Option 1: Docker Deployment

Automatically builds and tests Docker images. No secrets required for testing.

#### Option 2: Heroku Deployment

**Required Secrets:**
```
HEROKU_API_KEY      # Your Heroku API key
HEROKU_APP_NAME     # Your Heroku app name (e.g., idea-builder-test)
HEROKU_EMAIL        # Your Heroku account email
```

**Setup:**
1. Go to repository Settings → Secrets and variables → Actions
2. Add the required secrets
3. Run workflow manually or push to trigger

**Heroku Configuration:**
- The workflow uses the included `Procfile` (if created)
- Heroku will automatically detect Node.js and install dependencies
- Set config vars in Heroku dashboard:
  ```bash
  heroku config:set JWT_SECRET=your-secret-key -a idea-builder-test
  heroku config:set NODE_ENV=production -a idea-builder-test
  ```

#### Option 3: VPS Deployment

**Required Secrets:**
```
VPS_HOST            # IP address or hostname of your VPS
VPS_USERNAME        # SSH username
VPS_SSH_KEY         # Private SSH key for authentication
VPS_PORT            # SSH port (default: 22)
TEST_JWT_SECRET     # JWT secret for test environment
```

**VPS Setup Prerequisites:**
```bash
# On your VPS, install Node.js and PM2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2

# Create application directory
sudo mkdir -p /var/www/idea-builder-test
sudo chown $USER:$USER /var/www/idea-builder-test

# Clone repository
cd /var/www/idea-builder-test
git clone https://github.com/belriyad/idea-builder.git .

# Install dependencies
npm ci

# Start with PM2
pm2 start src/server.js --name idea-builder-test
pm2 save
pm2 startup  # Follow instructions to enable startup on boot
```

### Triggering Deployment

**Automatic (on push):**
- Push to any `copilot/**` branch triggers tests and build
- Deployment jobs only run on manual trigger

**Manual Deployment:**
1. Go to Actions tab in GitHub
2. Select "Deploy to Test Environment" workflow
3. Click "Run workflow"
4. Choose branch and run

## Manual Deployment Options

### Deploy to Heroku (CLI)

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Create app
heroku create idea-builder-test

# Set environment variables
heroku config:set JWT_SECRET=your-secret-key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Open app
heroku open
```

### Deploy to Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Set environment variables
railway variables set JWT_SECRET=your-secret-key

# Deploy
railway up
```

### Deploy to Render

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables:
   - `JWT_SECRET`: your-secret-key
   - `NODE_ENV`: production

### Deploy to DigitalOcean App Platform

1. Connect your GitHub repository
2. Select the repository and branch
3. Configure:
   - Build Command: `npm install`
   - Run Command: `npm start`
4. Add environment variables
5. Deploy

## Environment Variables

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `JWT_SECRET` | Secret key for JWT token signing | `your-secure-random-secret` |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment (development/test/production) | `development` |
| `STRIPE_SECRET_KEY` | Stripe API key for payments | - |

### Setting Environment Variables

**Docker:**
```bash
docker run -e JWT_SECRET=secret -e PORT=3000 idea-builder
```

**Docker Compose:**
```yaml
environment:
  - JWT_SECRET=secret
  - PORT=3000
```

**Heroku:**
```bash
heroku config:set JWT_SECRET=secret
```

**VPS (systemd):**
Create `/etc/systemd/system/idea-builder.service`:
```ini
[Service]
Environment="JWT_SECRET=secret"
Environment="PORT=3000"
```

## Health Checks

The application provides a health check endpoint:

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-26T10:00:00.000Z"
}
```

### Monitoring

**Docker health check:**
```bash
docker inspect --format='{{.State.Health.Status}}' idea-builder
```

**PM2 monitoring:**
```bash
pm2 status
pm2 logs idea-builder-test
pm2 monit
```

## Troubleshooting

### Application won't start

1. Check JWT_SECRET is set:
   ```bash
   # Should output your secret
   echo $JWT_SECRET
   ```

2. Check logs:
   ```bash
   # Docker
   docker logs idea-builder
   
   # PM2
   pm2 logs idea-builder-test
   
   # Heroku
   heroku logs --tail
   ```

### Health check fails

1. Verify application is running:
   ```bash
   curl -v http://localhost:3000/health
   ```

2. Check if port is correct:
   ```bash
   netstat -tulpn | grep 3000
   ```

### Tests fail in CI

1. Check test logs in GitHub Actions
2. Ensure all dependencies are installed
3. Verify NODE_ENV=test is set
4. Check that JWT_SECRET is provided for tests

## Production Considerations

Before deploying to production:

1. **Database**: Replace in-memory storage with PostgreSQL or MongoDB
2. **Secrets**: Use secure secret management (AWS Secrets Manager, HashiCorp Vault)
3. **HTTPS**: Enable SSL/TLS certificates
4. **Rate Limiting**: Already implemented, but verify limits are appropriate
5. **Logging**: Add structured logging (Winston, Pino)
6. **Monitoring**: Set up application monitoring (Datadog, New Relic)
7. **Backups**: Implement database backup strategy
8. **Scaling**: Consider load balancing and horizontal scaling
9. **CDN**: Use CDN for static assets
10. **Security Headers**: Add helmet.js middleware (already recommended in SECURITY.md)

## Support

For issues or questions about deployment:
1. Check the [README.md](README.md) for API documentation
2. Review [SECURITY.md](SECURITY.md) for security considerations
3. Open an issue on GitHub
