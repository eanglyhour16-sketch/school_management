const express = require("express");
const cors = require("cors");

const gradeRoutes = require("./routes/grade.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API is running"
  });
});
app.get("/learn", (req, res) => {
  res.json({
    success: true,
    message: "learn api"
  });
});

app.use("/api/grades", gradeRoutes);

module.exports = app;