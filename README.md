# Ride-Sharing Web App Backend

A robust, scalable backend API for a ride-sharing application built with Node.js, Express, PostgreSQL, Redis, and Prisma.

## Features

- **Authentication & Authorization**: Secure JWT-based authentication system
- **Ride Management**: Create, accept, track, and complete rides
- **User Management**: User profiles for both riders and drivers
- **Data Persistence**: PostgreSQL database with Prisma ORM
- **Caching**: Redis for enhanced performance and rate limiting
- **API Protection**: Rate limiting, CORS configuration, and security headers
- **Containerization**: Docker and Docker Compose for easy deployment
- **Logging**: Comprehensive logging system with Winston

## Technology Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Caching**: Redis
- **Authentication**: JWT (JSON Web Tokens)
- **API Validation**: Express Validator, Zod
- **Logging**: Winston
- **Containerization**: Docker, Docker Compose
- **Security**: Helmet, CORS, Rate Limiting

## Prerequisites

- Node.js 18.x or higher
- Docker and Docker Compose
- npm or yarn

## Getting Started

### Setup with Docker (Recommended)

1. Clone the repository:
   ```
   git clone https://github.com/AmnaMubarak/Ride-Sharing-Web-App-Backend.git
   cd Ride-Sharing-Web-App-Backend
   ```

2. Create a `.env` file in the root directory (see `.env.example` for required variables)

3. Start the containerized services:
   ```
   npm run docker:up
   ```

4. Run database migrations:
   ```
   npm run prisma:migrate
   ```

5. The API will be available at `http://localhost:5000`

### Local Development Setup

1. Clone the repository
   ```
   git clone https://github.com/AmnaMubarak/Ride-Sharing-Web-App-Backend.git
   cd Ride-Sharing-Web-App-Backend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start PostgreSQL and Redis with Docker Compose
   ```
   npm run docker:up
   ```

4. Set up environment variables (see `.env.example`)

5. Run database migrations
   ```
   npm run prisma:migrate
   ```

6. Start the development server
   ```
   npm run dev
   ```

## API Endpoints

- **Authentication**
  - `POST /api/auth/register` - Register a new user
  - `POST /api/auth/login` - Login and get JWT token

- **Users**
  - `GET /api/users/profile` - Get current user profile
  - `PUT /api/users/profile` - Update user profile

- **Rides**
  - `POST /api/rides` - Create a new ride request (for riders)
  - `GET /api/rides` - Get available rides (for drivers)
  - `GET /api/rides/history` - Get ride history
  - `PATCH /api/rides/:id/accept` - Accept a ride (for drivers)
  - `PATCH /api/rides/:id/complete` - Complete a ride
  - `PATCH /api/rides/:id/cancel` - Cancel a ride

## Database Schema

The application uses two main entities:

- **User**: Stores user information with roles (RIDER/DRIVER)
- **Ride**: Manages ride information, status, and relationships

## Available Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with hot reload
- `npm test` - Run tests
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio to inspect database
- `npm run docker:up` - Start Docker containers
- `npm run docker:down` - Stop Docker containers
- `npm run db:reset` - Reset the database (drops and recreates)

## Environment Variables

Create a `.env` file with the following variables:

```
# App
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ride_sharing_db

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=30d

# Logging
LOG_LEVEL=info
```
