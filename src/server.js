// npm install express mongoose redis dotenv cors && npm install -D jest nodemon supertest
//npm install -D mongodb-memory-server
require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 8009;

const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");

const startServer = async () => {
  await connectDB();
  await connectRedis();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`API running on port ${PORT}`);
  });
};

startServer();