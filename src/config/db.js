import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "SwiftX",
  password: "12345678",
  port: "5432",
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
