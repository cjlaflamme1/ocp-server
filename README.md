# Outdoor Community Project - Server

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)

## Overview

This is the backend server for the **Outdoor Community Project**, a platform designed to connect outdoor enthusiasts and facilitate group activities. The server provides a RESTful API built with NestJS and TypeScript, supporting features like user management, group creation, event organization, and social interactions.

> **Note**: This project is no longer actively maintained and is preserved for demo purposes only.

## Mobile App

The corresponding mobile application can be found at:
[Outdoor Community Project Mobile App](https://github.com/cjlaflamme1/ocpMobile)

## Features

- User authentication and authorization
- Group management and membership
- Event creation and RSVP system
- Activity tracking and sharing
- Push notifications
- File storage with AWS S3
- Real-time updates

## Technical Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: MySQL
- **ORM**: TypeORM
- **Authentication**: JWT
- **File Storage**: AWS S3
- **Push Notifications**: Expo Server SDK

## Getting Started

### Prerequisites

- Node.js (v22 or higher)
- MySQL (v8.0 or higher)
- AWS S3 bucket (for file storage)
- Expo account (for push notifications)
- Docker and Docker Compose (for containerized deployment)

### Installation

1. Clone the repository.

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```env
   DB_HOST=localhost
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_NAME=ocp_database
   JWT_SECRET=your_jwt_secret
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_BUCKET_NAME=your_bucket_name
   ```

### Running with Docker

1. Start the application:
   ```bash
   docker compose up
   ```

2. Stop the application:
   ```bash
   docker compose down
   ```

### Database Migrations

1. Generate a new migration:
   ```bash
   npx typeorm migration:generate ./migrations/[migration-name] -d /app/dist/ormconfig.js
   ```

2. Create a blank migration:
   ```bash
   npx typeorm migration:create ./migrations/[migration-name]
   ```

3. Run migrations in development:
   ```bash
   npx typeorm migration:run -d /app/dist/ormconfig.js
   ```

4. Run migrations in production:
   ```bash
   npx typeorm migration:run -d ./dist/ormconfig.js
   ```

### Development Server

Start the development server:
```bash
npm run start:dev
```

## API Documentation

The API documentation is available at `/api` when running the server locally.

## Contributing

As this project is no longer maintained, contributions are not being accepted. However, you are welcome to fork the repository for educational or demonstration purposes.

## License

This project is licensed under the UNLICENSED license - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [NestJS](https://nestjs.com/) - The framework used
- [TypeORM](https://typeorm.io/) - The ORM used
- [Expo](https://expo.dev/) - For push notification support
