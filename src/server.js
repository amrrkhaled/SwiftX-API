// src/app.js
import dotenv from "dotenv";

import express from "express";
import { connectDb } from "./config/db.js"; // Adjust the path as necessary

import { swaggerUi, swaggerSpec } from "./config/swagger.js"; // Import Swagger config
import bodyParser from "body-parser";
import cors from "cors";
// Import your routes
import authRoutes from "./routes/authRoutes.js"; 
import joggingRoutes from "./routes/joggingRoutes.js"; 
// import userRoutes from "./routes/userRoutes.js"; 
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
connectDb();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve Swagger API documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Use your routes
app.use(authRoutes);
// app.use("/", authRoutes);
app.use(joggingRoutes);
// app.use(userRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
