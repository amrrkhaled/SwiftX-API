# SwiftX-API
# Jogging Tracker API

Welcome to the **Jogging Tracker API**! This RESTful API allows users to log their jogging activities, manage their accounts, and generate insightful reports on their performance.


## Features

- **User Registration & Authentication**: Create and manage user accounts with JWT authentication.
- **Jogging Records**: Add, update, view, and delete jogging records.
- **Reports**: Generate reports on average speed and distance covered per week.
- **Admin Management**: Admins can manage users and their jogging records.
- **Token Blacklisting**: Support for logging out and invalidating JWT tokens.
- **Data Filtering**: Filter jogging records by date range.

## Technologies Used

- **Node.js**: JavaScript runtime for server-side applications.
- **Express**: Web framework for building RESTful APIs.
- **PostgreSQL**: Relational database management system for data storage.
- **JWT (JSON Web Token)**: For secure token-based authentication.
- **Bcrypt**: Password hashing library for enhanced security.
- **Cors**: Middleware for enabling Cross-Origin Resource Sharing.
- **dotenv**: For managing environment variables.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/jogging-tracker-api.git
   cd jogging-tracker-api
