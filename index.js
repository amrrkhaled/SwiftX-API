import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pg from "pg";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY;
const saltRounds = parseInt(process.env.SALT_ROUNDS);

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

const generateToken = (user) => {
  const payload = { email: user.email, role: user.role };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
};

let blacklistedTokens = [];

const authenticateJWT = (req, res, next) => {
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

app.post("/register", async (req, res) => {
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
    res.status(500).send("Error registering user");
  }
});

app.post("/login", async (req, res) => {
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
    const { name, age } = req.query;

    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    res.status(500).send("Error while logging in");
  }
});

app.post("/logout", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    blacklistedTokens.push(token);
    res.send("User logged out successfully");
  } else {
    res.status(400).send("No token provided");
  }
});

app.post("/jogging/add", authenticateJWT, async (req, res) => {
  const { date, time, distance } = req.body;
  console.log(req.body);
  const userEmail = req.user.email;
  console.log(userEmail);
  const joggingDate = new Date(date);

  try {
    const userQuery = "SELECT id FROM users WHERE email = $1";
    const userResult = await db.query(userQuery, [userEmail]);
    const user_id = userResult.rows[0].id;

    const query = `INSERT INTO joggings (user_id, date, time, distance) VALUES ($1, $2, $3::INTERVAL, $4)`;
    await db.query(query, [user_id, joggingDate, time, distance]);
    res.status(201).json({ message: "Jogging record created successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/jogging/view", authenticateJWT, async (req, res) => {
  const userEmail = req.user.email;
  const role = req.user.role;
  const { from, to } = req.query;

  const fromDate = from ? new Date(from) : null;
  const toDate = to ? new Date(to) : null;

  try {
    let query;
    const queryParams = [];

    if (role === "admin") {
      query = "SELECT * FROM joggings";

      if (fromDate && toDate) {
        query += " WHERE date BETWEEN $1 AND $2";
        queryParams.push(fromDate, toDate);
      }
    } else {
      const userQuery = "SELECT id FROM users WHERE email = $1";
      const userResult = await db.query(userQuery, [userEmail]);

      const user_id = userResult.rows[0].id;

      // Query for non-admin users
      query = "SELECT * FROM joggings WHERE user_id = $1";
      queryParams.push(user_id);

      // Apply date filter if both fromDate and toDate are provided
      if (fromDate && toDate) {
        query += " AND date BETWEEN $2 AND $3";
        queryParams.push(fromDate, toDate);
      }
    }

    // Execute the query
    const joggingRecords = await db.query(query, queryParams);
    res.status(200).json(joggingRecords.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/jogging/report", authenticateJWT, async (req, res) => {
  const userEmail = req.user.email;
  const role = req.user.role;

  try {
    const userQuery = "SELECT id FROM users WHERE email = $1";
    const userResult = await db.query(userQuery, [userEmail]);
    const user_id = userResult.rows[0].id;
    const query = `
    SELECT 
        EXTRACT(YEAR FROM date) AS year,
        EXTRACT(WEEK FROM date) AS week,
        AVG(distance) AS avg_distance,
        AVG(distance / EXTRACT(EPOCH FROM time) / 3600) AS avg_speed -- Adjust for interval type
    FROM joggings
    WHERE user_id = $1
    GROUP BY year, week
    ORDER BY year, week;
  `;
    
  const joggingRecords = await db.query(query, [user_id]);
    
    console.log(joggingRecords.rows)
    res.status(200).json(joggingRecords.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/jogging/:id", authenticateJWT, async (req, res) => {
  const { date, time, distance } = req.body;
  const joggingId = req.params.id;
  const userEmail = req.user.email;
  const role = req.user.role;

  try {
    if (role !== "admin") {
      const userQuery = "SELECT id FROM users WHERE email = $1";
      const userResult = await db.query(userQuery, [userEmail]);
      const user_id = userResult.rows[0].id;

      const joggingQuery =
        "SELECT * FROM joggings WHERE id = $1 AND user_id = $2";
      const joggingResult = await db.query(joggingQuery, [joggingId, user_id]);

      if (joggingResult.rows.length === 0) {
        return res.status(404).send("Jogging record not found");
      }
    }
    const updateQuery =
      "UPDATE joggings SET date = $1, time = $2::INTERVAL, distance = $3 WHERE id = $4";
    await db.query(updateQuery, [new Date(date), time, distance, joggingId]);
    res.send("Jogging record updated successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/jogging/:id", authenticateJWT, async (req, res) => {
  const joggingId = req.params.id;
  const userEmail = req.user.email;
  const role = req.user.role;

  try {
    if (role !== "admin") {
      const userQuery = "SELECT id FROM users WHERE email = $1";
      const userResult = await db.query(userQuery, [userEmail]);
      const user_id = userResult.rows[0].id;

      const joggingQuery =
        "SELECT * FROM joggings WHERE id = $1 AND user_id = $2";
      const joggingResult = await db.query(joggingQuery, [joggingId, user_id]);

      if (joggingResult.rows.length === 0) {
        return res.status(404).send("Jogging record not found");
      }
    }
    await db.query("DELETE FROM joggings WHERE id = $1", [joggingId]);
    res.send("Jogging record deleted successfully");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.post("/users", authenticateJWT, async (req, res) => {
  const { email, password, role } = req.body;
  const staffRole = req.user.role;

  if (staffRole !== "admin" && staffRole !== "manager") {
    return res.status(403).send("Not authorized to create users");
  }

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (checkResult.rows.length > 0) {
      return res.status(409).send("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query =
      "INSERT INTO users (email, password, role) VALUES ($1, $2, $3)";
    await db.query(query, [email, hashedPassword, role]);
    res.status(201).send("User created successfully");
  } catch (err) {
    res.status(500).send("Error creating user");
  }
});

app.get("/users", authenticateJWT, async (req, res) => {
  const staffRole = req.user.role;

  if (staffRole !== "admin" && staffRole !== "manager") {
    return res.status(403).send("Not authorized to view users");
  }

  try {
    const usersResult = await db.query(
      "SELECT id, email, role FROM users WHERE role = 'regular' "
    );
    res.status(200).json(usersResult.rows);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.put("/users/:id", authenticateJWT, async (req, res) => {
  const userId = req.params.id;
  const { email, password, role } = req.body;
  const staffRole = req.user.role;

  if (staffRole !== "admin" && staffRole !== "manager") {
    return res.status(403).send("Not authorized to edit users");
  }

  try {
    const hashedPassword = password
      ? await bcrypt.hash(password, saltRounds)
      : undefined;

    const updateQuery = `
      UPDATE users
      SET 
        email = $1,
        password = $2,
        role = $3
      WHERE id = $4`;

    await db.query(updateQuery, [email, hashedPassword, role, userId]);
    res.send("User updated successfully");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/users/:id", authenticateJWT, async (req, res) => {
  const userId = req.params.id;
  const staffRole = req.user.role;
  console.log(userId);

  if (staffRole !== "admin" && staffRole !== "manager") {
    return res.status(403).send("Not authorized to delete users");
  }

  try {
    await db.query("DELETE FROM joggings WHERE user_id = $1", [userId]);
    await db.query("DELETE FROM users WHERE id = $1", [userId]);
    res.send("User deleted successfully");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
