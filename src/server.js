import dotenv from "dotenv";
import express from "express";
import { connectDb } from "./config/db.js"; 
import { swaggerUi, swaggerSpec } from "./config/swagger.js"; // Import Swagger config
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js"; 
import joggingRoutes from "./routes/joggingRoutes.js"; 
import usersRoutes from "./routes/usersRoutes.js"; 
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
connectDb();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//  Swagger API documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//  routes
app.use(authRoutes);
app.use(joggingRoutes);
app.use(usersRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);

});
