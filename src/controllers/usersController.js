import { db } from "../config/db.js";

export const addUser = async (req, res) => {
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
};

export const getUsers = async (req, res) => {
    const staffRole = req.user.role;
    const userId = req.query.id; // Assuming ID is sent as a query parameter
  
    // Check authorization for admin and manager roles
    if (staffRole !== "admin" && staffRole !== "manager") {
      return res.status(403).send("Not authorized to view users");
    }
  
    try {
      let usersResult;
  
      // If user ID is provided, fetch the specific user; otherwise, fetch all regular users
      if (userId) {
        usersResult = await db.query(
          "SELECT id, email, role FROM users WHERE id = $1 AND role = 'regular'",
          [userId] // Parameterized query to prevent SQL injection
        );
  
        // Check if the user exists
        if (usersResult.rows.length === 0) {
          return res.status(404).send("User not found");
        }
      } else {
        usersResult = await db.query(
          "SELECT id, email, role FROM users WHERE role = 'regular'"
        );
      }
  
      // Send the retrieved users or user
      res.status(200).json(usersResult.rows);
    } catch (error) {
      console.error("Error fetching users:", error); // Log the error for debugging
      res.status(500).send("Internal Server Error");
    }
  };
  
export const editUser = async (req, res) => {
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
};

export const deleteUser = async (req, res) => {
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
};
