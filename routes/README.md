# User Management API with JWT Authentication

## Project Overview

This project is a REST API built using Node.js, Express.js, and MongoDB. It allows users to register, log in, view user information, update their own account, and delete their account. JWT authentication protects the user-management routes.

## Technologies Used

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- dotenv
- Postman

## Features

- User registration and login
- Secure password hashing using bcryptjs
- JWT-based authentication
- Create, read, update, and delete operations
- Protected API routes
- Input validation and duplicate-email checks
- Password hashes excluded from API responses

## Installation

1. Clone the repository.
2. Open the project folder in a terminal.
3. Install dependencies:

   `npm install`

4. Create a `.env` file in the project root:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_long_random_secret
   PORT=5000
   ```

5. Start the development server:

   `npm run dev`

The API runs at `http://localhost:5000`.

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Log in and receive a JWT |

### User Management

Include the JWT in the Authorization header as `Bearer YOUR_TOKEN` for all user-management routes.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users/me` | View your own profile |
| GET | `/api/users` | View all users |
| GET | `/api/users/:id` | View a user by ID |
| PUT | `/api/users/:id` | Update your own account |
| DELETE | `/api/users/:id` | Delete your own account |

## Testing

The API routes were tested using Postman, including registration, login, protected profile access, retrieving users, updating user details, and deleting a user.

## Security

- Passwords are hashed before being stored.
- JWT tokens expire after one hour.
- User-management routes require authentication.
- Users can update or delete only their own accounts.
- Environment variables should never be committed to GitHub.

## Author

Sandhya R
