import bcrypt from "bcrypt";
import {db} from "../config/db.js"
import { generateToken,verifyToken} from "../middlewares/authMiddleware.js";
const saltRounds = parseInt(process.env.SALT_ROUNDS);
export let blacklistedTokens = [];

export const register = async (req,res)=>{
    const { email, password, role } = req.body;
    console.log(req.body);
  
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
  
      if (checkResult.rows.length > 0) {
        return res.status(409).send("User already exists");
      } else {
        const query =
          "INSERT INTO users (email, password, role) VALUES ($1, $2, $3)";
        await db.query(query, [email, hashedPassword, role]);
        res.send("User registered successfully");
      }
    } catch (err) {
      console.log(err)
        res.status(500).send("Error registering user");
    }  
};
export const login = async (req,res)=>{

    const { email, password } = req.body;
  console.log(req.body);

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length == 0) {
      return res.status(404).send("User not found");
    }

    const user = checkResult.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).send("Invalid email or password");
    }
    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    console.log(err)
    res.status(500).send("Error while logging in");
  }
};

export const logout = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
  
    if (token) {
      blacklistedTokens.push(token);
      res.send("User logged out successfully");
    } else {
      res.status(400).send("No token provided");
    }
  };