# Freelance Marketplace Project Structure Documentation
Version 1.0.0

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Setup Instructions](#4-setup-instructions)
5. [Development Guidelines](#5-development-guidelines)

## 1. Project Overview

### 1.1 Description
A modern freelance marketplace platform built with the MERN stack (MongoDB, Express.js, React, Node.js) using TypeScript.

### 1.2 Key Features
- User Authentication & Authorization
- Project Creation and Management
- Proposal System
- Real-time Messaging
- Payment Processing
- Search and Filter System

## 2. Technology Stack

### 2.1 Frontend
- React 18.2.0
- TypeScript 5.2.2
- Redux Toolkit 1.9.5
- Tailwind CSS 3.3.3
- Socket.io-client 4.7.2
- Formik 2.4.3
- Yup 1.2.0

### 2.2 Backend
- Node.js
- Express.js 4.18.2
- MongoDB (mongoose 7.5.0)
- TypeScript 5.2.2
- JWT Authentication
- Socket.io 4.7.2

### 2.3 Development Tools
- Docker & Docker Compose
- Vite
- ESLint & Prettier
- Git

## 3. Project Structure

### 3.1 Root Directory Structure
```
freelance-marketplace/
├── package.json
├── docker-compose.yml
├── README.md
├── client/
└── server/
```

### 3.2 Client Structure
```
client/
├── package.json
├── tsconfig.json
├── .env
├── public/
└── src/
    ├── App.tsx
    ├── index.tsx
    ├── assets/         # Static assets
    │   ├── images/
    │   └── fonts/
    ├── components/     # Reusable components
    │   ├── common/
    │   │   ├── Button/
    │   │   ├── Input/
    │   │   ├── Card/
    │   │   └── Modal/
    │   ├── layout/
    │   │   ├── Navbar.tsx
    │   │   ├── Footer.tsx
    │   │   └── Sidebar.tsx
    │   └── forms/
    │       ├── LoginForm.tsx
    │       └── RegisterForm.tsx
    ├── pages/          # Route components
    │   ├── Home/
    │   ├── Auth/
    │   ├── Projects/
    │   ├── Profile/
    │   └── Messages/
    ├── features/       # Redux logic
    │   ├── auth/
    │   ├── projects/
    │   └── users/
    ├── hooks/          # Custom hooks
    │   ├── useAuth.ts
    │   └── useForm.ts
    ├── services/       # API integration
    │   ├── api.ts
    │   └── socket.ts
    ├── utils/          # Helper functions
    │   ├── validation.ts
    │   └── formatters.ts
    ├── types/          # TypeScript types
    └── styles/         # Global styles
```

### 3.3 Server Structure
```
server/
├── package.json
├── tsconfig.json
├── .env
└── src/
    ├── index.ts
    ├── app.ts
    ├── config/
    │   ├── database.ts
    │   ├── express.ts
    │   └── env.ts
    ├── routes/
    │   ├── index.ts
    │   ├── auth.routes.ts
    │   ├── project.routes.ts
    │   └── user.routes.ts
    ├── controllers/
    │   ├── auth.controller.ts
    │   ├── project.controller.ts
    │   └── user.controller.ts
    ├── models/
    │   ├── User.ts
    │   ├── Project.ts
    │   └── Proposal.ts
    ├── middleware/
    │   ├── auth.ts
    │   ├── error.ts
    │   └── validation.ts
    ├── services/
    │   ├── email.service.ts
    │   └── payment.service.ts
    ├── utils/
    │   ├── jwt.ts
    │   └── helpers.ts
    └── types/
        └── express.d.ts
```

## 4. Setup Instructions

### 4.1 Prerequisites
- Node.js (v16 or higher)
- Docker and Docker Compose
- Git

### 4.2 Installation Steps
1. Clone the repository:
```bash
git clone [repository-url]
cd freelance-marketplace
```

2. Install dependencies:
```bash
npm install
cd client && npm install
cd ../server && npm install
```

3. Set up environment variables:
```bash
# In client/.env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000

# In server/.env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/freelance
JWT_SECRET=your_jwt_secret
```

4. Start development environment:
```bash
# Start MongoDB and Redis
docker-compose up -d

# Start development servers
npm run dev
```

## 5. Development Guidelines

### 5.1 Code Style
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Use functional components with hooks in React
- Implement proper error handling
- Write meaningful comments and documentation

### 5.2 Component Structure
- Keep components small and focused
- Use TypeScript interfaces for props
- Implement error boundaries
- Use proper loading and error states

### 5.3 State Management
- Use Redux Toolkit for global state
- Local state with useState when appropriate
- Implement proper loading states
- Handle errors gracefully

### 5.4 API Integration
- Use axios for HTTP requests
- Implement proper error handling
- Use TypeScript interfaces for API responses
- Keep API calls in services directory

### 5.5 Git Workflow
- Use feature branches
- Write meaningful commit messages
- Follow conventional commits
- Create detailed pull requests

### 5.6 Testing
- Write unit tests for utilities
- Implement integration tests for API
- Test components with React Testing Library
- Maintain good test coverage

### 5.7 Performance
- Implement lazy loading
- Use proper memoization
- Optimize images and assets
- Monitor bundle size

### 5.8 Security
- Implement proper authentication
- Validate all inputs
- Sanitize data
- Use proper CORS settings
- Implement rate limiting

### 5.9 Documentation
- Keep README updated
- Document API endpoints
- Add JSDoc comments
- Maintain changelog

## 6. Deployment

### 6.1 Production Build
```bash
# Build client
cd client && npm run build

# Build server
cd ../server && npm run build
```

### 6.2 Environment Variables
Ensure all necessary environment variables are set in production:
- Database connection
- JWT secrets
- API keys
- Environment-specific configs

### 6.3 Deployment Checklist
- Set up proper monitoring
- Configure logging
- Set up CI/CD pipeline
- Configure proper security measures
- Set up backup strategy

## 7. Support and Maintenance

### 7.1 Monitoring
- Set up error tracking
- Monitor performance metrics
- Track user analytics
- Monitor server health

### 7.2 Updates
- Keep dependencies updated
- Monitor security advisories
- Plan regular maintenance
- Document update procedures

---
*End of Documentation*
