CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL
);
CREATE TABLE joggings (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    time INTERVAL NOT NULL,
    distance DOUBLE PRECISION NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
