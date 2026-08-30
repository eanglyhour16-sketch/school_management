const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

const gradeRoutes = require("./routes/grade.routes");
const studentRoute = require("./routes/student.route");
const swaggerSpec = require("./config/swagger");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerSpec));
app.use("/api/grades", gradeRoutes);
app.use("/api/students", studentRoute);
app.use(errorHandler);

module.exports = app;