import { db } from "../config/db.js";

export const addJog =  async (req, res) => {
    const { date, time, distance } = req.body;
    const userEmail = req.user.email;
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
  };

export const viewJogs=  async (req, res) => {
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
      const joggingRecords = await db.query(query, queryParams);
      res.status(200).json(joggingRecords.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  export const jogsReport= async (req, res) => {
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
      res.status(200).json(joggingRecords.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  export const editJog= async (req, res) => {
    const { date, time, distance } = req.body;
    const joggingId = req.params.id;
    console.log(joggingId + "dd")
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
  };
  
 export const deleteJog=  async (req, res) => {
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
  };