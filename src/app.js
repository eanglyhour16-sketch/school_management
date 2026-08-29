const express = require("express");
const cors = require("cors");

const gradeRoutes = require("./routes/grade.routes");
const studentRoute = require("./routes/student.route");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/grades", gradeRoutes);
app.use("/api/students", studentRoute);
app.use(errorHandler);

module.exports = app;