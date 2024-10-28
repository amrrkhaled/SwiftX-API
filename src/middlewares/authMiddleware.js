import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.SECRET_KEY;
import { blacklistedTokens } from "../controllers/authController.js";


 export const generateToken = (user) => {
    const payload = { email: user.email, role: user.role };
    return jwt.sign(payload,SECRET_KEY, { expiresIn: "1h" });
  };
  

  
  export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      if (blacklistedTokens.includes(token)) {
        return res.status(403).send("Token is blacklisted. Please log in again.");
      }
  
      jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
          return res.status(403).send("Invalid or expired token");
        }
        req.user = user;
        next();
      });
    } else {
      res.status(401).send("Access denied, token missing");
    }
  };