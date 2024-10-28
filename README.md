# Jogging Tracker API

Welcome to the **Jogging Tracker API**! This RESTful API is designed to help users log their jogging activities, monitor progress, and manage user accounts. With robust authentication and role-based access control, it's perfect for both regular users and staff members.

## 🚀 Features

- **User Authentication**: Secure login and registration with JWT (JSON Web Tokens).
- **Role Management**: Different access levels for regular users, managers, and admins.
- **Jogging Records**: Log jogging sessions, including date, distance, and time.
- **Activity Reports**: Generate weekly reports on average speed and distance.
- **User Management**: Admin and manager capabilities for user creation, updating, and deletion.
- **Robust Error Handling**: Clear feedback for successful and failed requests.

## 📦 Getting Started

### Prerequisites

- Node.js (version X.X.X or higher)
- PostgreSQL (version X.X.X or higher)
- An .env file for environment variables

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/jogging-tracker-api.git
   cd jogging-tracker-api
2. **Install Dependencies**
   ```bash
   npm install
3. **Set Up Environment Variables Create a .env file in the root directory with the following variables**

    ```bash
    SECRET_KEY=your_secret_key
    SALT_ROUNDS=10
    DB_USER=your_db_user
    DB_HOST=your_db_host
    DB_NAME=your_db_name
    DB_PASSWORD=your_db_password
    DB_PORT=your_db_port
4. **Run the application**
   ```bash
   npm start
5.**Access the API Open your browser or a tool like Postman or Swagger and go to http://localhost:3000.**

## 🛠 API Endpoints

### User Management
- **POST** `/register`: Register a new user.
- **POST** `/login`: Log in and receive a JWT token.
- **POST** `/logout`: Log out and blacklist the token.
- **GET** `/users`: Retrieve all users (admin/manager only).
- **POST** `/users`: Create a new user (admin/manager only).
- **PUT** `/users/:id`: Update user information (admin/manager only).
- **DELETE** `/users/:id`: Delete a user (admin/manager only).

### Jogging Records
- **POST** `/jogging/add`: Log a new jogging session.
- **GET** `/jogging/view`: View jogging records (filtered by date for admin).
- **GET** `/jogging/report`: Generate a report of jogging statistics.
- **PUT** `/jogging/:id`: Update an existing jogging record.
- **DELETE** `/jogging/:id`: Delete a jogging record.

🔒 Security
This API uses JWT for user authentication. Ensure to keep your secret key safe and use HTTPS in production.

📖 Documentation
For more details on how to use the API, refer to the Swagger Documentation once it's set up.



