# SnapGuard

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/)
[![Groq](https://img.shields.io/badge/Groq-FF6B6B?style=for-the-badge&logoColor=white)](https://groq.com/)

SnapGuard is a Real-Time Cyber Threat Assistant (RT-CTA) multimodal, AI-powered application that monitors and detects cybersecurity threats in real time by analyzing multiple data inputs. The application leverages Groq's ultra-fast inference capabilities to process inputs from:

 - <strong>Live Webcam/Screen Captures:</strong> For visual clues (e.g., suspicious behavior, malware UI elements).

 - <strong>Audio Channels:</strong> To capture and analyze verbal cues or background noise that might indicate phishing calls or unauthorized access.

 - <strong>Textual Inputs:</strong> Through chat interfaces and system logs for contextual threat analysis.

## Features

- 🔐 Secure user authentication and authorization
- 📸 Multimodal Input Analysis
- 🔄 Real-Time Inference with Groq
- 👥 User Interface & Notifications
- 🌐 System Security & Data Privacy

## Team members
Frontend Developer : Prerit Kotak <br>
Backend Developer : Hardik Kasliwal

## Tech Stack

### Backend
- Node.js
- Express.js
- Supabase
- JSON Web Tokens (JWT)
- bcryptjs for password hashing

### Frontend
- React.js
- Supabase Client
- Modern UI components

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

## Environment Variables

Create `.env` files in both server and client directories:

### Server (.env)
```
PORT=3001
JWT_SECRET=your_jwt_secret_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NODE_ENV=development
```

### Client (.env)
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_API_URL=http://localhost:3001
```

## Installation & Setup

1. Clone the repository:
```bash
git clone https://github.com/Kotak-Prerit/snapgaurd.git
cd snapguard
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

4. Set up environment variables:
   - Create `.env` files in both server and client directories
   - Fill in the required environment variables as shown above

5. Start development servers:

Server:
```bash
cd server
npm run dev
```

Client:
```bash
cd client
npm start
```

## API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user
- Body: `{ email, password, name }`
- Returns: `{ token, user }`

#### POST /api/auth/login
Login existing user
- Body: `{ email, password }`
- Returns: `{ token, user }`

### User Endpoints

#### GET /api/users/profile
Get user profile (requires authentication)
- Headers: `Authorization: Bearer <token>`
- Returns: `{ id, email, name, created_at }`

#### PUT /api/users/profile
Update user profile (requires authentication)
- Headers: `Authorization: Bearer <token>`
- Body: `{ name }`
- Returns: Updated user object

#### DELETE /api/users/account
Delete user account (requires authentication)
- Headers: `Authorization: Bearer <token>`
- Returns: Success message

## Development Guide

1. Code Structure:
   - `/server/src/routes/` - API endpoints
   - `/server/src/middleware/` - Custom middleware
   - `/client/src/components/` - React components
   - `/client/src/pages/` - Page components
   - `/client/src/services/` - API services

2. Adding New Features:
   - Create new routes in appropriate route files
   - Add corresponding frontend components
   - Update API documentation
   - Test thoroughly

3. Testing:
   - Write unit tests for new features
   - Test API endpoints using Postman/Insomnia
   - Perform end-to-end testing

## Production Deployment Guide

1. Backend Deployment:
   - Set `NODE_ENV=production`
   - Configure production database
   - Set up proper CORS settings
   - Use process manager (PM2)
   - Set up SSL certificate
   - Configure reverse proxy (Nginx/Apache)

2. Frontend Deployment:
   - Build production bundle: `npm run build`
   - Configure production API endpoints
   - Set up CDN for static assets
   - Configure client-side routing

3. Environment Setup:
   - Set up production environment variables
   - Configure proper security headers
   - Set up monitoring and logging
   - Configure backup systems

4. Deployment Checklist:
   - [ ] Update environment variables
   - [ ] Build and test production builds
   - [ ] Configure domain and SSL
   - [ ] Set up monitoring
   - [ ] Configure backups
   - [ ] Test all features in production

## Security Considerations

1. Always use environment variables for sensitive data
2. Implement rate limiting in production
3. Use secure headers (helmet.js)
4. Regular security audits
5. Keep dependencies updated
6. Implement proper error handling
7. Use secure authentication methods

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
