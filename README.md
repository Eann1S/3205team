# NestJS Backend Project

A modern NestJS backend application with Docker support, PostgreSQL integration, and REST API capabilities.

## Features

- Short URL generation and management
- URL redirection
- URL expiration
- URL click tracking
- URL statistics

## Technologies

- REST API endpoints with Swagger documentation
- Dockerized development environment
- PostgreSQL database integration
- Environment configuration management
- ESLint and Prettier code formatting
- Jest testing framework
- TypeORM integration
- Class-transformer for data transformation
- Class-validator for data validation

## Getting Started

### Prerequisites

- Docker 20.10+
- Docker Compose 2.20+
- Node.js 18+
- npm 9+

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/yourrepo.git
   cd yourrepo
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

3. **Build and start containers**
   ```bash
   docker-compose up -d --build
   ```

4. **Access the application**
   - API: http://localhost:3000
   - Swagger Docs: http://localhost:3000/api

### Without Docker

1. **Install dependencies**
   ```bash
   cd backend && npm install
   ```

2. **Start development server**
   ```bash
   npm run start:dev
   ```

## Environment Variables

The following environment variables are required (see `.env.example`):

- `POSTGRES_HOST`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`

## API Documentation

Swagger documentation is automatically generated and available at:
[http://localhost:3000/api](http://localhost:3000/api)

## Running Tests

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e
```

