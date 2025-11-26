# 💡 Idea Builder

Transform Your Business Ideas into Actionable Plans

## Overview

Idea Builder is a comprehensive platform designed to help new entrepreneurs transform their business ideas into structured, actionable plans. The platform breaks down ideas into a tree of features, generates Product Requirements Documents (PRDs), and connects users with partner engineering teams for implementation.

## Features

### 🎯 Core Features

1. **Idea Structuring Tool** - Parse business ideas and generate structured feature trees
2. **Tree Generation** - Visual representation of business features and their relationships
3. **Feature Selection** - Choose which features to include in your product
4. **PRD Document Generation** - Generate comprehensive PRDs ($5 fee)
5. **Document Customization** - Customize PRDs to fit your needs
6. **AI Guidance** - Structured PRD formatting for AI development
7. **Human Review Option** - Expert review of PRDs ($100 fee)
8. **Partner Integration** - Connect with engineering teams
9. **Partner Signup** - Partners can register to bid on projects
10. **Subscription Plans** - Monthly ($100) or Annual ($75/month) partner plans
11. **Project Bidding** - Partners bid on projects using PRD details

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/belriyad/idea-builder.git

# Navigate to project directory
cd idea-builder

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start the server
npm start
```

### Development

```bash
# Run in development mode with auto-reload
npm run dev

# Run tests
npm test
```

## API Documentation

### Authentication

#### Register User
```http
POST /api/test/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/test/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Idea Structuring

#### Create Idea
```http
POST /api/ideas
Authorization: Bearer {token}
Content-Type: application/json

{
  "idea_text": "Your business idea description..."
}
```

#### Get Idea
```http
GET /api/ideas/{id}
Authorization: Bearer {token}
```

#### Update Idea
```http
PUT /api/ideas/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "structure": { ... }
}
```

#### Export Idea
```http
GET /api/ideas/export/{id}?format=json
Authorization: Bearer {token}
```

### Feature Selection

#### Get Feature Tree
```http
GET /api/features/tree
Authorization: Bearer {token}
```

#### Save Feature Selection
```http
POST /api/features/selection
Authorization: Bearer {token}
Content-Type: application/json

{
  "selectedFeatures": ["feature-id-1", "feature-id-2"]
}
```

#### Get User Selections
```http
GET /api/features/selection
Authorization: Bearer {token}
```

### PRD Generation

#### Generate PRD ($5)
```http
POST /api/prd/generate
Authorization: Bearer {token}
Content-Type: application/json

{
  "payment_token": "tok_...",
  "template_id": "default",
  "project_details": { ... }
}
```

#### Submit for Human Review ($100)
```http
POST /api/prd/review
Authorization: Bearer {token}
Content-Type: application/json

{
  "payment_token": "tok_...",
  "prd_document": { ... }
}
```

#### Get Review Status
```http
GET /api/prd/review/status?review_id={id}
Authorization: Bearer {token}
```

### Partner Integration

#### Partner Signup
```http
POST /api/partners/signup
Content-Type: application/json

{
  "email": "partner@example.com",
  "password": "password123"
}
```

#### Verify Email
```http
GET /api/partners/verify?token={verification_token}
```

#### Send Connection Request
```http
POST /api/partners/request
Authorization: Bearer {token}
Content-Type: application/json

{
  "partner_id": "partner-id"
}
```

### Subscriptions

#### Get Plans
```http
GET /api/subscriptions/plans
Authorization: Bearer {token}
```

#### Subscribe to Plan
```http
POST /api/subscriptions/subscribe
Authorization: Bearer {token}
Content-Type: application/json

{
  "plan_type": "monthly",
  "payment_token": "tok_..."
}
```

### Projects & Bidding

#### Get Projects
```http
GET /api/projects
```

#### Create Project
```http
POST /api/projects
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Project Title",
  "description": "Project description",
  "prd_details": { ... }
}
```

#### Submit Bid
```http
POST /api/projects/{id}/bid
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 5000,
  "timeline": "3 months"
}
```

## Payment Integration

The platform uses Stripe for payment processing:

- **PRD Generation**: $5 fee
- **Human Review**: $100 fee
- **Partner Monthly Plan**: $100/month
- **Partner Annual Plan**: $75/month (billed annually at $900)

For testing, use the token `test_payment_token` to simulate successful payments.

## Technology Stack

- **Backend**: Node.js, Express
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Payment Processing**: Stripe
- **Testing**: Jest, Supertest
- **Frontend**: HTML, CSS, JavaScript (Vanilla)

## Project Structure

```
idea-builder/
├── src/
│   ├── controllers/     # Request handlers
│   ├── routes/          # API routes
│   ├── models/          # Data models (in-memory store)
│   ├── middleware/      # Authentication middleware
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── server.js        # Main server file
├── public/              # Static files (frontend)
├── tests/               # Test files
├── .env.example         # Environment variables template
├── .gitignore          # Git ignore file
├── package.json        # Dependencies and scripts
└── README.md           # This file
```

## Testing

Run the test suite:

```bash
npm test
```

The tests cover:
- Authentication (register, login)
- Idea structuring (create, read, update, delete, export)
- Feature selection
- PRD generation
- Partner integration
- Subscriptions
- Project bidding

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC

## Contact

For questions or support, please open an issue on GitHub.
