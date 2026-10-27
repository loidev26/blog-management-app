
# Posts API

# Application Description

The Posts API is a backend application that allows users to view posts and administrators to create, update, and delete posts. It uses Node.js, Express.js, and MongoDB with Mongoose for database management. JWT authentication is used to protect administrator-only operations.

# Features

- View all posts
- View a single post
- Create a new post (Admin only)
- Update an existing post (Admin only)
- Delete a post (Admin only)
- User authentication and authorization

# Login Credentials

## Regular User
- Email: user@mail.com
- Password: user12345

## Administrator
- Email: admin@mail.com
- Password: admin12345

# Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs

# Installation

1. Clone or download the project.
2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory and configure the following variables:

   ```env
   PORT=4000
   MONGODB_STRING=your_mongodb_connection_string
   JWT_SECRET_KEY=your_jwt_secret_key
   ```

4. Start the server:

   ```bash
   npm start
   ```

# API Endpoints

Method: POST
Endpoint: /users/register
Description: Register a user
Access: Public

Method: POST
Endpoint: /users/login
Description: Log in a user
Access: Public

Method: POST
Endpoint: /posts/addPost
Description: Create a post
Access: Admin

Method: GET
Endpoint: /posts/getAllPosts
Description: Retrieve all posts
Access: Public

Method: GET
Endpoint: /posts/getPost/:id
Description: Retrieve a specific post
Access: Public

Method: PUT
Endpoint: /posts/updatePost/:id
Description: Update a post
Access: Admin

Method: DELETE
Endpoint: /posts/deletePost/:id
Description: Delete a post
Access: Admin

# Notes

- Include a valid JWT in the Authorization header for protected endpoints.
- Admin-only endpoints require an administrator account.
- The login credentials above must correspond to accounts that have been created in the database.
