import pg from "pg";

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const connectDb = async () => {
  try {
    await db.connect();
  } catch (err) {
    console.log(err);
    console.error("Database connection failed");
  }
};
export { db, connectDb };
